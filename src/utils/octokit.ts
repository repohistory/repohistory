/* eslint-disable import/prefer-default-export */
import { App } from 'octokit';

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n');
export const app = new App({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  privateKey,
});
