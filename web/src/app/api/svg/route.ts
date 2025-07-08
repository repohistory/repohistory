import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/utils/octokit/app';

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

    console.log('Repository info:', {
      name: repoInfo.data.full_name,
      stars: repoInfo.data.stargazers_count,
      created: repoInfo.data.created_at,
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

    console.log('Stargazers data:', stargazers.data.slice(0, 5)); // Log first 5 entries
    console.log('Total stargazers in this page:', stargazers.data.length);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // If repo is not accessible, redirect to repohistory.com
    return NextResponse.redirect('https://repohistory.com');
  }

  // Create display text from parameters
  const displayText = `repo: ${repo}, type: ${type}, size: ${size}, theme: ${theme}, transparent: ${transparent}`;

  const svg = `
    <svg width="600" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" stroke="#333" stroke-width="2"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="12" fill="#333">
        ${displayText}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}
