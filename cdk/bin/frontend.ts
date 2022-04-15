import { App } from 'aws-cdk-lib';
import { FrontendConstruct } from '../lib/frontend-stack';

const app = new App();
new FrontendConstruct(app, 'Frontend-riskRoller', {
  env: {
    account: '577280981174',
    region: 'us-east-1'
  },
  domainNames: ['staging-centerstage.sight-sound.com'],
  deploymentSource: '../dist/'
});
