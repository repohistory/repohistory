#!/usr/bin/env tsx

import nextEnv from '@next/env';
import { App } from "octokit";
import { writeFileSync } from 'fs';
import { join } from 'path';

const projectDir = process.cwd();
nextEnv.loadEnvConfig(projectDir);

interface Repo {
  fullName: string;
  starCount: number;
}

const appId = process.env.APP_ID;
const privateKey = process.env.APP_PRIVATE_KEY;

if (!appId || !privateKey) {
  console.error("Missing required environment variables:");
  console.error("- APP_ID: GitHub App ID");
  console.error("- APP_PRIVATE_KEY: GitHub App private key");
  process.exit(1);
}

const app = new App({
  appId,
  privateKey,
});

const allRepos: Repo[] = [];

app.eachInstallation(({ installation }) => {
  if (installation.suspended_at) {
    return;
  }

  app.eachRepository({ installationId: installation.id }, ({ repository }) => {
    if (repository.stargazers_count > 5000) {
      console.log(repository.full_name, repository.stargazers_count);

      allRepos.push({
        fullName: repository.full_name,
        starCount: repository.stargazers_count,
      });
    }
  });
}).then(() => {
  const popularRepos = allRepos.sort((a, b) => b.starCount - a.starCount);

  const outputPath = join(process.cwd(), 'repos.json');
  writeFileSync(outputPath, JSON.stringify(popularRepos, null, 2) + '\n');

  console.log(`Found ${popularRepos.length} repositories with more than 5,000 stars.`);
  console.log(`Saved to: ${outputPath}`);
}).catch((error) => {
  console.error("Error fetching repositories:", error);
  process.exit(1);
});

