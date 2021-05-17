const cdk = require('@aws-cdk/core');
const rds = require('@aws-cdk/aws-rds');
const ec2 = require('@aws-cdk/aws-ec2');
const s3 = require('@aws-cdk/aws-s3');
class JscdkappStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
            isDefault: true,
            subnetGroupNameTag: "smsubnet",
            tags: { ["Name"]: "smvpc" }	,
            vpcId: "vpc-c0b209ab",
            vpcName: "smvpc",
        })

        const instance = new rds.DatabaseInstance(this, 'Instance', {
            engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
            instanceIdentifier: "bookconference-lsm",
            licenseModel: rds.LicenseModel.BRING_YOUR_OWN_LICENSE,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
            credentials: rds.Credentials.fromPassword('admin', "qwe123qwe"),
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            securityGroups: ["sg-75e20f0e"],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        new s3.Bucket(this, 'jscdkapp', {
            versioned: true,
            bucketName: "bucket-lsm",
            /*publicReadAccess: true,*/
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        const ec2instance = new ec2.Instance(this, 'ec2Instance', {
            instanceType: "t2.micro",
            instanceName: "ec2-lsm",
            machineImage: ec2.MachineImage.genericLinux({ ['ap-northeast-2']: 'ami-081511b9e3af53902' }),
            securityGroup:{
                securityGroupId: 'sg-07a1eb89822ce8fdf'
            },
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            securityGroups: ["sg-75e20f0e"],
            keyName: "personal3"
        });
    }
}
module.exports = { JscdkappStack }



