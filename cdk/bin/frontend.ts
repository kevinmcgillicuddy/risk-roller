import { App } from 'aws-cdk-lib';
import { RiskRollerStack } from '../lib/frontend-stack';

const app = new App();
let riskRollerStack = new RiskRollerStack(app, 'frontend-riskRoller', {
  env: {
    account: 'AWS_ACCOUNT',
    region: 'us-east-1'
  },
  domainNames: ['risk-roller.mcgilicuddy.dev'],
  deploymentSource: '../dist/'
});
