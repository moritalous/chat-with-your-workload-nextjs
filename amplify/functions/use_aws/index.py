import json
import logging

from strands import Agent
from strands_tools import use_aws

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    AWS Lambda function handler that uses the use_aws utility from strands_tools.

    Args:
        event (dict): The event data passed to the Lambda function
        context (object): The Lambda execution context

    Returns:
        dict: API Gateway response with status code and body
    """
    logger.info(f"Event received: {json.dumps(event)}")

    try:
        params = event.get("arguments", {})
        service = params.get("service_name", "")
        operation = params.get("operation_name", "")
        parameters = params.get("parameters", {})
        region = params.get("region", "us-east-1")
        label = params.get("label", "")

        logger.info(
            f"Processing AWS request: service={service}, operation={operation}, region={region}, label={label}"
        )

        agent = Agent(tools=[use_aws])

        logger.info(
            f"Executing AWS operation with parameters: {json.dumps(parameters)}"
        )
        result = agent.tool.use_aws(
            service_name=service,
            operation_name=operation,
            region=region,
            parameters=parameters,
            label=label,
        )
        logger.info("AWS operation executed successfully")

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "success": True,
                    "result": result,
                }
            ),
        }
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)

        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "success": False,
                    "error": str(e),
                }
            ),
        }
