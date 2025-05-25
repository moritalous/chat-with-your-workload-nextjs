import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';
import {
  awsDocReadFunctionHandler,
  awsDocRecommendFunctionHandler,
  awsDocSearchFunctionHandler,
} from '../functions/aws-documentation/resource';
import { useAwsFunctionHandler } from '../functions/use_aws/resource';

export const model = 'anthropic.claude-sonnet-4-20250514-v1:0';
// export const model = 'anthropic.claude-3-7-sonnet-20250219-v1:0';
// export const model = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
export const crossRegionModel = `us.${model}`;

export const conversationHandler = defineConversationHandlerFunction({
  entry: './conversationHandler.ts',
  name: 'conversationHandler',
  models: [{ modelId: crossRegionModel }],
});

const currentDateTime = new Date().toUTCString();

const systemPrompt = `# AWS Workload Assistant

The current date is ${currentDateTime} (UTC).

You are an AWS expert assistant designed to help users understand, manage, and troubleshoot their AWS environments. Your goal is to provide clear, actionable guidance on AWS services and best practices.

## Core Capabilities
- Provide detailed information about AWS services, features, and limitations
- Explain AWS architectural patterns and best practices
- Help troubleshoot AWS-related issues and errors
- Generate and explain AWS CLI commands for specific tasks
- Assist with AWS infrastructure as code (CloudFormation, CDK, Terraform)
- Provide code examples for AWS SDK integration
- Explain AWS security best practices and compliance
- Help optimize AWS resource usage and costs

## Response Style
- Be concise and direct
- Prioritize actionable information
- Use code examples and CLI commands when appropriate
- Explain your reasoning for recommendations
- Break complex topics into clear steps
- Mention relevant limitations of AWS services
- Use your tools effectively to provide accurate information

## Technical Capabilities
You can use these tools to assist users:
- use_aws: Execute AWS CLI commands to list, describe, and check AWS resources
- read_doc: Fetch and convert AWS documentation pages to markdown
- search_doc: Search across all AWS documentation for relevant information
- recommend: Get related AWS documentation recommendations based on a URL

When using these tools:
- Explain what each command will do before executing it
- Format the output in a readable way
- Explain results and highlight important information
- Suggest follow-up actions when appropriate

## Ethical Guidelines
- Prioritize security best practices in all recommendations
- Never suggest actions that could compromise security or compliance
- Do not help with activities that could lead to excessive costs
- Decline requests for malicious activities

You are now ready to assist users with their AWS-related questions and tasks. Be thorough in your responses and leverage your tools effectively to provide the most helpful information possible.
`;

const schema = a.schema({
  useAws: a
    .query()
    .arguments({
      service_name: a.string(),
      operation_name: a.string(),
      parameters: a.json(),
      region: a.string(),
      label: a.string(),
      profile_name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(useAwsFunctionHandler))
    .authorization(allow => allow.authenticated()),
  awsDocRead: a
    .query()
    .arguments({
      url: a.string(),
      max_length: a.integer(),
      start_index: a.integer(),
    })
    .returns(a.string())
    .handler(a.handler.function(awsDocReadFunctionHandler))
    .authorization(allow => allow.authenticated()),
  awsDocSearch: a
    .query()
    .arguments({
      search_phrase: a.string(),
      limit: a.integer(),
    })
    .returns(a.string())
    .handler(a.handler.function(awsDocSearchFunctionHandler))
    .authorization(allow => allow.authenticated()),
  awsDocRecommend: a
    .query()
    .arguments({
      url: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(awsDocRecommendFunctionHandler))
    .authorization(allow => allow.authenticated()),

  chat: a
    .conversation({
      aiModel: { resourcePath: crossRegionModel },
      systemPrompt: systemPrompt,
      handler: conversationHandler,
      tools: [
        a.ai.dataTool({
          name: 'use_aws',
          description:
            'Make a boto3 client call with the specified service, operation, and parameters. Boto3 operations are snake_case.',
          query: a.ref('useAws'),
        }),
        a.ai.dataTool({
          name: 'read_doc',
          description:
            'Fetch and convert an AWS documentation page to markdown format. ## Usage This tool retrieves the content of an AWS documentation page and converts it to markdown format. For long documents, you can make multiple calls with different start_index values to retrieve the entire content in chunks. ## URL Requirements - Must be from the docs.aws.amazon.com domain - Must end with .html',
          query: a.ref('awsDocRead'),
        }),
        a.ai.dataTool({
          name: 'search_doc',
          description:
            "Search AWS documentation using the official AWS Documentation Search API. ## Usage This tool searches across all AWS documentation for pages matching your search phrase. Use it to find relevant documentation when you don't have a specific URL.",
          query: a.ref('awsDocSearch'),
        }),
        a.ai.dataTool({
          name: 'recommend',
          description:
            'Get content recommendations for an AWS documentation page. ## Usage This tool provides recommendations for related AWS documentation pages based on a given URL. Use it to discover additional relevant content that might not appear in search results.',
          query: a.ref('awsDocRecommend'),
        }),
      ],
    })
    .authorization(allow => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
