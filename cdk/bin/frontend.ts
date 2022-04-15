import { App } from 'aws-cdk-lib';
import { FrontendConstruct } from '../lib/frontend-stack';

const app = new App();
new FrontendConstruct(app, 'Frontend-riskRoller', {
  env: {
    account: '***REMOVED***',
    region: 'us-east-1'
  },
  domainNames: ['***REMOVED***'],
  deploymentSource: '../dist/'
});
