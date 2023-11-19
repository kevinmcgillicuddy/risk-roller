import { App } from 'aws-cdk-lib';
import { RiskRollerStack } from '../lib/frontend-stack';

const app = new App();
const AWS_ACCOUNT = process.env.AWS_ACCOUNT as string;
new RiskRollerStack(app, 'frontend-riskRoller', {
  env: {
    account: AWS_ACCOUNT,
    region: 'us-east-1'
  },
  domainNames: ['risk-roller.mcgillicuddy.dev'],
  deploymentSource: '../dist/'
});
