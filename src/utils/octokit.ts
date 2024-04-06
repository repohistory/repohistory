/* eslint-disable import/prefer-default-export */
import { App } from 'octokit';

const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');
export const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey,
});
