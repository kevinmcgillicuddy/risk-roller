import {
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy, CfnOutput,
  Duration,
  RemovalPolicy,
  StackProps
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface FrontendConstructProps extends StackProps {
  /**
   * The domain name for the site to use
   */
  readonly domainNames?: string[];
  /**
   * Location of FE code to deploy
   */
  readonly deploymentSource: string;
  /**
   * Optional custom sources for CloudFront to proxy to
   */
  readonly customBehaviors?: Record<string, cloudfront.BehaviorOptions>;
  /**
   * Optional additional paths to files that should not be cached
   * Includes index.html, robots.txt, favicon.ico, and config.json by default
   */
  readonly noCachePaths?: string[];
  /**
   * Override the CloudFront distribution ID for migration purposes
   */
  readonly distributionLocalIdOverride?: string;
}

// some code taken from https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
export class RiskRollerStack extends Construct {
  private readonly noCachePaths: string[];
  private readonly certificate: acm.Certificate;
  public readonly distribution: cloudfront.Distribution;

  constructor(parent: Construct, id: string, props: FrontendConstructProps) {
    super(parent, id);

    this.noCachePaths = [
      ...(props.noCachePaths ? props.noCachePaths : []),
      'index.html',
      'robots.txt',
      'favicon.ico',
    ];

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    if (props.domainNames) {
      // TLS certificate
      this.certificate = new acm.Certificate(this, 'SiteCertificate', {
        domainName: props.domainNames[0]
      });
      new CfnOutput(this, 'Certificate', { value: this.certificate.certificateArn });
    }

    const origin = new cloudfrontOrigins.S3Origin(siteBucket);

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'CloudFrontResponseHeaders', {
      securityHeadersBehavior: {
        strictTransportSecurity: {
          accessControlMaxAge: Duration.days(365 * 2),
          includeSubdomains: true,
          preload: true,
          override: true
        },
        contentTypeOptions: {
          override: true
        },
        xssProtection: {
          modeBlock: true,
          override: true,
          protection: true
        },
        frameOptions: {
          frameOption: cloudfront.HeadersFrameOption.SAMEORIGIN,
          override: true
        },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN,
          override: true
        }
      }
    });

    const defaultBehavior: cloudfront.BehaviorOptions = {
      origin,
      compress: true,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      responseHeadersPolicy
    };

    const noCacheBehavior: cloudfront.BehaviorOptions = {
      ...defaultBehavior,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
    };

    this.distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      domainNames: props.domainNames ? props.domainNames : undefined,
      certificate: props.domainNames ? this.certificate : undefined,
      errorResponses: [{
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: '/index.html'
      }, {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html'
      }],
      defaultRootObject: 'index.html',
      defaultBehavior,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      additionalBehaviors: {
        ...this.noCachePaths.reduce((obj, path) => {
          obj[path] = noCacheBehavior;
          return obj;
        }, {} as Record<string, any>),
        ...(props.customBehaviors ? props.customBehaviors : {})
      }
    });

    // used for migration from CloudFrontWebDistribution to Distribution
    // https://stackoverflow.com/a/68764093/5991792
    if (props.distributionLocalIdOverride) {
      (this.distribution.node.defaultChild as cloudfront.CfnDistribution).overrideLogicalId(props.distributionLocalIdOverride);
    }

    new CfnOutput(this, 'DistributionId', { value: this.distribution.distributionId });
    new CfnOutput(this, 'DistributionDomainname', { value: this.distribution.distributionDomainName });

    const s3Asset = s3deploy.Source.asset(props.deploymentSource);

    // https://blog.kewah.com/2021/cdk-pattern-static-files-s3-cloudfront/
    const deployment = new s3deploy.BucketDeployment(this, 'S3Deployment', {
      sources: [s3Asset],
      destinationBucket: siteBucket,
      retainOnDelete: true,
      distribution: this.distribution,
      memoryLimit: 1769, // one full vCPU
      exclude: this.noCachePaths,
      cacheControl: [
        s3deploy.CacheControl.setPublic(),
        s3deploy.CacheControl.maxAge(Duration.days(365)),
        s3deploy.CacheControl.fromString('immutable')
      ]
    });

    const noCacheDeployment = new s3deploy.BucketDeployment(this, 'S3DeploymentNoCache', {
      sources: [s3Asset],
      destinationBucket: siteBucket,
      retainOnDelete: true,
      distribution: this.distribution,
      memoryLimit: 1769, // one full vCPU
      exclude: ['*'],
      include: this.noCachePaths,
      cacheControl: [
        s3deploy.CacheControl.setPublic(),
        s3deploy.CacheControl.maxAge(Duration.days(0)),
        s3deploy.CacheControl.sMaxAge(Duration.days(0))
      ]
    });

    noCacheDeployment.node.addDependency(deployment); // ensure deployment goes before noCacheDeployment so that bucket is pruned first
  }
}
