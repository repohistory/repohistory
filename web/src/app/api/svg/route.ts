import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { app } from '@/utils/octokit/app';
import { JSDOM } from 'jsdom';
import { optimize, Config } from 'svgo';
import XYChart from '@/shared/packages/xy-chart';
import { convertDataToChartData } from '@/shared/common/chart';
import { replaceSVGContentFilterWithCamelcase, getBase64Image, getChartWidthWithSize } from '@/shared/common/star-utils';
import { getRepoStars } from '@/utils/repo/stars';

// Cache only the repo data (GitHub API calls), not the SVG output
const getCachedRepoData = unstable_cache(
  async (repo: string) => {
    const [owner, repoName] = repo.split('/');

    // Check if repo has app installation
    const appOctokit = app.octokit;
    const { data: installation } = await appOctokit.rest.apps.getRepoInstallation({
      owner,
      repo: repoName,
    });

    const octokit = await app.getInstallationOctokit(installation.id);

    const repoInfo = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    const repoStarsData = await getRepoStars(octokit, {
      fullName: repo,
      stargazersCount: repoInfo.data.stargazers_count,
    });

    const starRecords = repoStarsData.starsHistory.map((entry) => ({
      date: entry.date,
      count: entry.cumulative,
    }));

    // Convert avatar to base64 for GitHub markdown compatibility
    const avatarUrl = repoInfo.data.owner.avatar_url;
    const logoUrl = avatarUrl ? await getBase64Image(`${avatarUrl}&size=22`) : '';

    return {
      repo,
      starRecords,
      logoUrl,
    };
  },
  ['repo-data'],
  {
    revalidate: 86400, // 24 hours
    tags: ['repo-data']
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // API design: /svg?repo=owner/repo&type=Date&theme=light&transparent=false&size=laptop&color=ff6b6b
  const repo = searchParams.get('repo') || '';
  const type = searchParams.get('type') || 'Date';
  const theme = searchParams.get('theme') || 'light';
  const transparent = searchParams.get('transparent') || 'false';
  const size = searchParams.get('size') || 'laptop';
  const color = searchParams.get('color'); // Custom color parameter

  try {
    // Validate repo parameter
    if (!repo) {
      throw new Error('Repository parameter is required');
    }
    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    // Get cached repo data
    const repoData = await getCachedRepoData(repo);

    // Create virtual DOM
    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    const body = dom.window.document.querySelector("body");
    const svg = dom.window.document.createElement("svg") as unknown as SVGSVGElement;

    if (!dom || !body || !svg) {
      throw new Error('Failed to mock dom with JSDOM');
    }

    body.append(svg);
    svg.setAttribute("width", `${getChartWidthWithSize(size)}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Prepare chart options with custom color if provided
    const chartOptions: {
      xTickLabelType: "Date" | "Number";
      chartWidth: number;
      dataColors?: string[];
    } = {
      xTickLabelType: type === "Date" ? "Date" : "Number",
      chartWidth: getChartWidthWithSize(size),
    };

    // Add custom color if provided (hex color without #)
    if (color && /^[0-9A-Fa-f]{6}$/.test(color)) {
      chartOptions.dataColors = [`#${color}`];
    }

    // Generate chart (always fresh)
    XYChart(
      svg,
      {
        title: "Star History",
        xLabel: type === "Date" ? "Date" : "Timeline",
        yLabel: "GitHub Stars",
        data: convertDataToChartData([repoData], type as "Date" | "Timeline"),
        showDots: false,
        transparent: transparent.toLowerCase() === "true",
        theme: theme === "dark" ? "dark" : "light",
      },
      chartOptions
    );

    // Optimize SVG
    const svgContent = replaceSVGContentFilterWithCamelcase(svg.outerHTML);
    const options: Config = {
      multipass: true,
    };
    const optimized = optimize(svgContent, options).data;

    return new NextResponse(optimized, {
      headers: {
        'Content-Type': 'image/svg+xml;charset=utf-8',
        'Cache-Control': 'max-age=86400',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // If repo is not accessible, redirect to repohistory.com
    return NextResponse.redirect('https://repohistory.com');
  }
}
