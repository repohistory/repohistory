import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/utils/octokit/app';
import { JSDOM } from 'jsdom';
import { optimize, Config } from 'svgo';
import XYChart from '@/shared/packages/xy-chart';
import { convertDataToChartData } from '@/shared/common/chart';
import { replaceSVGContentFilterWithCamelcase, getBase64Image, getChartWidthWithSize } from '@/shared/common/star-utils';
import { getRepoStarsChart } from '@/utils/repo/stars';
import { getRepoInfo } from '@/utils/repo/info';
import { getOptimalStrokeColor } from '@/utils/color';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // API design: /svg?repo=owner/repo&type=Date&background=0D1117&size=laptop&color=ff6b6b
  const fullName = searchParams.get('repo') || '';
  const type = searchParams.get('type') || 'Date';
  const background = searchParams.get('background') || 'FFFFFF';
  const size = searchParams.get('size') || 'laptop';
  const color = searchParams.get('color');

  try {
    if (!fullName) {
      throw new Error('Repository parameter is required');
    }
    const [owner, repo] = fullName.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid repository format. Use owner/repo');
    }

    const appOctokit = app.octokit;
    const { data: installations } = await appOctokit.rest.apps.listInstallations();

    if (installations.length === 0) {
      throw new Error('No installations found');
    }

    const randomInstallation = installations[Math.floor(Math.random() * installations.length)];
    const octokit = await app.getInstallationOctokit(randomInstallation.id);

    const repoInfo = await getRepoInfo(octokit, owner, repo);

    const repoStarsData = await getRepoStarsChart(octokit, {
      fullName: fullName,
      stargazersCount: repoInfo.stargazers_count,
    });

    const starRecords = repoStarsData.starsHistory.map((entry) => ({
      date: entry.date,
      count: entry.cumulative,
    }));

    const avatarUrl = repoInfo.owner.avatar_url;
    const logoUrl = avatarUrl ? await getBase64Image(`${avatarUrl}&size=22`) : '';

    const repoData = {
      repo: fullName,
      starRecords,
      logoUrl,
    };

    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    const body = dom.window.document.querySelector("body");
    const svg = dom.window.document.createElement("svg") as unknown as SVGSVGElement;

    if (!dom || !body || !svg) {
      throw new Error('Failed to mock dom with JSDOM');
    }

    body.append(svg);
    svg.setAttribute("width", `${getChartWidthWithSize(size)}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const normalizedBackground = background.startsWith('#') ? background : `#${background}`;
    const strokeColor = getOptimalStrokeColor(normalizedBackground);
    
    const chartOptions: {
      xTickLabelType: "Date" | "Number";
      chartWidth: number;
      dataColors?: string[];
      backgroundColor?: string;
      strokeColor?: string;
    } = {
      xTickLabelType: type === "Date" ? "Date" : "Number",
      chartWidth: getChartWidthWithSize(size),
      backgroundColor: normalizedBackground,
      strokeColor: strokeColor,
    };

    if (color && /^[0-9A-Fa-f]{6}$/.test(color)) {
      chartOptions.dataColors = [`#${color}`];
    }

    XYChart(
      svg,
      {
        title: "Star History",
        xLabel: type === "Date" ? "Date" : "Timeline",
        yLabel: "GitHub Stars",
        data: convertDataToChartData([repoData], type as "Date" | "Timeline"),
        showDots: false,
        transparent: false,
        theme: strokeColor === "#ffffff" ? "dark" : "light",
      },
      chartOptions
    );

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

    return NextResponse.redirect('https://repohistory.com');
  }
}
