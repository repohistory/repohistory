import updateTraffic from './services/updateTraffic';
import { app } from './utils/octokit';

app.eachInstallation(({ installation }) => {
  try {
    updateTraffic(installation.id);
  } catch (error) {
    console.error(`An unexpected error occurred for installation with id '${installation.id}'`, error);
  }
});
