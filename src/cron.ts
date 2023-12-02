import updateTraffic from './services/updateTraffic';
import { app } from './utils/octokit';

app.eachInstallation(({ installation }) => {
  updateTraffic(installation.id);
});
