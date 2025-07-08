import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/utils/octokit/app';
import { JSDOM } from 'jsdom';
import { optimize, Config } from 'svgo';
import XYChart from '@/shared/packages/xy-chart';
import { convertDataToChartData } from '@/shared/common/chart';
import { getChartWidthWithSize, replaceSVGContentFilterWithCamelcase } from '@/shared/common/star-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters (similar to star-history but with 'repo' instead of 'repos')
  const repo = searchParams.get('repo') || 'No repo specified';
  const type = searchParams.get('type') || 'Date';
  const size = searchParams.get('size') || 'laptop';
  const theme = searchParams.get('theme') || 'light';
  const transparent = searchParams.get('transparent') || 'false';

  try {
    // Validate repo parameter
    if (repo === 'No repo specified') {
      throw new Error('Repository parameter is required');
    }

    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    // Check if repo has app installation (simpler approach)
    const appOctokit = app.octokit;
    const { data: installation } = await appOctokit.rest.apps.getRepoInstallation({
      owner,
      repo: repoName,
    });

    console.log('Found installation:', installation.id, 'for repo:', repo);

    // Get octokit for this installation
    const octokit = await app.getInstallationOctokit(installation.id);

    // Get repository info
    const repoInfo = await octokit.rest.repos.get({
      owner,
      repo: repoName,
    });

    // Get stargazers (first page for testing)
    const stargazers = await octokit.rest.activity.listStargazersForRepo({
      owner,
      repo: repoName,
      headers: {
        accept: 'application/vnd.github.v3.star+json',
      },
      per_page: 100,
    });

    console.log('Total stargazers in this page:', stargazers.data.length);

    // Convert stargazers data to chart format (simple version with 1 page)
    const starRecords = stargazers.data
      .filter((star) => star.starred_at) // Filter out entries without starred_at
      .map((star, index: number) => ({
        date: star.starred_at!,
        count: index + 1, // Simple increment for demo
      }));

    // Prepare repo data for chart
    const repoData = [{
      repo: repo,
      starRecords: starRecords,
      logoUrl: repoInfo.data.owner.avatar_url || '',
    }];

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

    // Generate chart
    XYChart(
      svg,
      {
        title: "Star History",
        xLabel: type === "Date" ? "Date" : "Timeline",
        yLabel: "GitHub Stars",
        data: convertDataToChartData(repoData, type as "Date" | "Timeline"),
        showDots: false,
        transparent: transparent.toLowerCase() === "true",
        theme: theme === "dark" ? "dark" : "light",
      },
      {
        xTickLabelType: type === "Date" ? "Date" : "Number",
        chartWidth: getChartWidthWithSize(size),
      }
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
        'Cache-Control': 'max-age=86400'
      }
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // If repo is not accessible, redirect to repohistory.com
    return NextResponse.redirect('https://repohistory.com');
  }
}
