import { defineBackend } from '@aws-amplify/backend';
import { aws_iam } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';

import { conversationHandler, crossRegionModel, data, model } from './data/resource';
import {
  awsDocReadFunctionHandler,
  awsDocRecommendFunctionHandler,
  awsDocSearchFunctionHandler,
} from './functions/aws-documentation/resource';
import { useAwsFunctionHandler } from './functions/use_aws/resource';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  conversationHandler,
  useAwsFunctionHandler,
  awsDocReadFunctionHandler,
  awsDocRecommendFunctionHandler,
  awsDocSearchFunctionHandler,
});

backend.conversationHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:us-east-1:${backend.stack.account}:inference-profile/${crossRegionModel}`,
      `arn:aws:bedrock:us-east-1::foundation-model/${model}`,
      `arn:aws:bedrock:us-east-2::foundation-model/${model}`,
      `arn:aws:bedrock:us-west-2::foundation-model/${model}`,
    ],
    actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
  })
);

backend.useAwsFunctionHandler.resources.lambda.role?.addManagedPolicy(
  aws_iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')
);
