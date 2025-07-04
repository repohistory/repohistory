import '@/env-config'
import { app } from '@/utils/octokit/app';
import { updateTraffic } from './utils/update-traffic';

app.eachInstallation(async ({ installation }) => {
  if (installation.suspended_at) {
    return
  }

  updateTraffic(installation.id)
});
