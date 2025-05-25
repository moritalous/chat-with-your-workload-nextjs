import { defineFunction } from '@aws-amplify/backend';
import { DockerImage, Duration } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { execSync } from 'node:child_process';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const awsDocReadFunctionHandler = defineFunction(
  scope =>
    new Function(scope, 'aws-doc-read', {
      handler: 'index.read_doc_handler',
      runtime: Runtime.PYTHON_3_12,
      timeout: Duration.seconds(120),
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry('dummy'),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `pip3 install -r ${path.join(functionDir, 'requirements.txt')} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    })
);

export const awsDocSearchFunctionHandler = defineFunction(
  scope =>
    new Function(scope, 'aws-doc-search', {
      handler: 'index.search_doc_handler',
      runtime: Runtime.PYTHON_3_12,
      timeout: Duration.seconds(120),
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry('dummy'),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `pip3 install -r ${path.join(functionDir, 'requirements.txt')} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    })
);

export const awsDocRecommendFunctionHandler = defineFunction(
  scope =>
    new Function(scope, 'aws-doc-recommend', {
      handler: 'index.recommend_handler',
      runtime: Runtime.PYTHON_3_12,
      timeout: Duration.seconds(120),
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry('dummy'),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `pip3 install -r ${path.join(functionDir, 'requirements.txt')} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    })
);
