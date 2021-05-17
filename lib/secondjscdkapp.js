const cdk = require("@aws-cdk/core")
const { JscdkappStack } = require('../lib/jscdkapp-stack');
const app = new cdk.App();
new JscdkappStack(app, 'secondjscdkapp', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
});