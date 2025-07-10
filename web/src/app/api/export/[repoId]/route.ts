import { NextRequest, NextResponse } from 'next/server';
import { getUserOctokit } from '@/utils/octokit/get-user-octokit';
import { createClient } from '@/utils/supabase/server';
import { getRepoViews } from '@/utils/repo/views';
import { getRepoClones } from '@/utils/repo/clones';
import { getRepoReferrers } from '@/utils/repo/referrers';
import { getRepoPaths } from '@/utils/repo/paths';
import JSZip from 'jszip';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ repoId: string }> }
) {
  try {
    const resolvedParams = await params;
    const repoId = parseInt(resolvedParams.repoId);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const fullName = searchParams.get('repo');

    if (!fullName || format !== 'csv') {
      return new NextResponse('Invalid parameters', { status: 400 });
    }

    const octokit = await getUserOctokit();
    const supabase = await createClient();

    // Fetch all data in parallel
    const [viewsResult, clonesResult, referrersResult, pathsResult] = await Promise.allSettled([
      getRepoViews(octokit, supabase, fullName, repoId),
      getRepoClones(octokit, supabase, fullName, repoId),
      getRepoReferrers(octokit, supabase, fullName, repoId),
      getRepoPaths(octokit, supabase, fullName, repoId)
    ]);

    const zip = new JSZip();
    const repoSlug = fullName.replace('/', '-');

    // Process Views data
    if (viewsResult.status === 'fulfilled') {
      const { views } = viewsResult.value;
      const data = views.map(item => ({
        date: item.timestamp,
        total: item.count,
        unique: item.uniques
      }));

      const csv = convertToCSV(data, ['date', 'total', 'unique'], ['Date', 'Total Views', 'Unique Views']);
      zip.file('views.csv', csv);
    }

    // Process Clones data
    if (clonesResult.status === 'fulfilled') {
      const { clones } = clonesResult.value;
      const data = clones.map(item => ({
        date: item.timestamp,
        total: item.count,
        unique: item.uniques
      }));

      const csv = convertToCSV(data, ['date', 'total', 'unique'], ['Date', 'Total Clones', 'Unique Clones']);
      zip.file('clones.csv', csv);
    }

    // Process Referrers data
    if (referrersResult.status === 'fulfilled') {
      const { referrers } = referrersResult.value;

      // Convert to chart data format for CSV
      const dateMap = new Map<string, Record<string, string | number>>();
      referrers.forEach(referrer => {
        referrer.data.forEach(item => {
          if (!dateMap.has(item.timestamp)) {
            dateMap.set(item.timestamp, { date: item.timestamp });
          }
          dateMap.get(item.timestamp)![referrer.referrer] = item.count;
        });
      });

      const chartData = Array.from(dateMap.values())
        .sort((a, b) => (a.date as string).localeCompare(b.date as string));

      if (chartData.length > 0) {
        const headers = Object.keys(chartData[0]);
        const csv = convertToCSV(chartData, headers, headers.map(h => h === 'date' ? 'Date' : h));
        zip.file('referrers.csv', csv);
      }
    }

    // Process Popular Content data
    if (pathsResult.status === 'fulfilled') {
      const { paths } = pathsResult.value;

      // Convert to chart data format for CSV
      const dateMap = new Map<string, Record<string, string | number>>();
      paths.forEach(pathItem => {
        pathItem.data.forEach(item => {
          if (!dateMap.has(item.timestamp)) {
            dateMap.set(item.timestamp, { date: item.timestamp });
          }
          dateMap.get(item.timestamp)![pathItem.path] = item.count;
        });
      });

      const chartData = Array.from(dateMap.values())
        .sort((a, b) => (a.date as string).localeCompare(b.date as string));

      if (chartData.length > 0) {
        const headers = Object.keys(chartData[0]);
        const csv = convertToCSV(chartData, headers, headers.map(h => h === 'date' ? 'Date' : h));
        zip.file('popular-content.csv', csv);
      }
    }

    // Generate zip file
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${repoSlug}-data-csv.zip"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Export failed', { status: 500 });
  }
}

function convertToCSV(data: Record<string, string | number>[], keys: string[], headers: string[]): string {
  if (data.length === 0) {
    return '';
  }

  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      keys.map(key => {
        const value = row[key];
        // Escape commas and quotes in CSV values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value?.toString() || '0';
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}
