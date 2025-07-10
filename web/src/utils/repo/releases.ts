import { Octokit } from "octokit";

export interface RepoReleaseData {
  totalDownloads: number;
  releases: Array<{
    tagName: string;
    name: string;
    publishedAt: string;
    downloadCount: number;
  }>;
}

export async function getRepoReleases(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoReleaseData> {
  try {
    const { data } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: 100,
    });

    const releases = data.map(release => {
      const downloadCount = release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
      return {
        tagName: release.tag_name,
        name: release.name || release.tag_name,
        publishedAt: release.published_at || release.created_at,
        downloadCount,
      };
    });

    const totalDownloads = releases.reduce((sum, release) => sum + release.downloadCount, 0);

    return {
      totalDownloads,
      releases,
    };
  } catch (error) {
    console.error("Error fetching releases data:", error);
    return {
      totalDownloads: 0,
      releases: [],
    };
  }
}