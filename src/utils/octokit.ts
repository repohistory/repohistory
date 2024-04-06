/* eslint-disable import/prefer-default-export */
import { App } from 'octokit';

export const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.APP_PRIVATE_KEY,
});
