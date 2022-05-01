import { App } from 'aws-cdk-lib';
import { RiskRollerStack } from '../lib/frontend-stack';

const app = new App();
const AWS_ACCOUNT = process.env.AWS_ACCOUNT as string;
const DOMAIN_NAME = process.env.DOMAIN_NAME as string;
new RiskRollerStack(app, 'frontend-riskRoller', {
  env: {
    account: AWS_ACCOUNT,
    region: 'us-east-1'
  },
  domainNames: [...DOMAIN_NAME],
  deploymentSource: '../dist/'
});
