import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { useShellClient } from '@ovh-ux/shell';

import { getShellClient, setShellClient } from './shell';

useShellClient('dedicated')
  .then((client) => {
    if (!isTopLevelApplication()) {
      client.ux.startProgress();
    }

    setShellClient(client);
    return client.environment.getEnvironment();
  })
  .then((environment) => {
    environment.setVersion(__VERSION__);

    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: startApplication }) => {
        startApplication(document.body, getShellClient());
      });
  });
