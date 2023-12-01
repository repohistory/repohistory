import { app } from '../utils/octokit';
import updateTraffic from './updateTraffic';

export default function updateAllTraffic() {
  app.eachInstallation(({ installation }) => {
    updateTraffic(installation.id);
  });
}
