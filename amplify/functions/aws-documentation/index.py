import asyncio
import json
import logging
from typing import List

from awslabs.aws_documentation_mcp_server.server import (
    RecommendationResult,
    SearchResult,
    read_documentation,
    recommend,
    search_documentation,
)


class Context:
    """Dummy Context"""

    def error(self, message: str) -> None:
        print(f"ERROR: {message}")
        return None


ctx = Context()

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def read_documentation_sync(ctx, url, max_length=5000, start_index=0) -> str:
    logger.info(
        f"Calling read_documentation with url={url}, max_length={max_length}, start_index={start_index}"
    )
    result = asyncio.run(
        read_documentation(ctx, url=url, max_length=max_length, start_index=start_index)
    )
    logger.info(f"Successfully retrieved documentation from {url}")
    return result


def search_documentation_sync(ctx, search_phrase, limit=10) -> List[SearchResult]:
    logger.info(f"Searching documentation with phrase='{search_phrase}', limit={limit}")
    result = asyncio.run(
        search_documentation(ctx, search_phrase=search_phrase, limit=limit)
    )
    logger.info(f"Search completed, found {len(result)} results")
    return result


def recommend_sync(ctx, url) -> List[RecommendationResult]:
    logger.info(f"Getting recommendations for url={url}")
    result = asyncio.run(recommend(ctx, url=url))
    logger.info(f"Successfully retrieved {len(result)} recommendations")
    return result


def read_doc_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")

    try:
        arguments = event.get("arguments", {})
        url = arguments.get("url", {})
        try:
            max_length = int(arguments.get("max_length", 5000))
        except (ValueError, TypeError):
            max_length = 5000
        try:
            start_index = int(arguments.get("start_index", 0))
        except (ValueError, TypeError):
            start_index = 0

        logger.info(
            f"Processing read_documentation request: url={url}, max_length={max_length}, start_index={start_index}"
        )

        result = read_documentation_sync(
            ctx, url=url, max_length=max_length, start_index=start_index
        )
        logger.info("Documentation read operation completed successfully")

        # Replace print with logger
        logger.debug(f"Documentation content: {result[:100]}...")

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


def search_doc_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")

    try:
        arguments = event.get("arguments", {})
        search_phrase = arguments.get("search_phrase", "")
        try:
            limit = int(arguments.get("limit", 10))
        except (ValueError, TypeError):
            limit = 10

        logger.info(
            f"Processing search_documentation request: search_phrase='{search_phrase}', limit={limit}"
        )

        result = search_documentation_sync(
            ctx, search_phrase=search_phrase, limit=limit
        )
        logger.info(
            f"Documentation search completed successfully with {len(result)} results"
        )

        # Replace print with logger
        logger.debug(f"Search results: {result[:3] if result else []}")

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "success": True,
                    "result": list(map(lambda x: x.model_dump_json(), result)),
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


def recommend_handler(event, context):
    logger.info(f"Event received: {json.dumps(event)}")

    try:
        arguments = event.get("arguments", {})
        url = arguments.get("url", {})

        logger.info(f"Processing recommend request: url={url}")

        result = recommend_sync(ctx, url=url)
        logger.info(
            f"Recommendation operation completed successfully with {len(result)} recommendations"
        )

        # Replace print with logger
        logger.debug(f"Recommendation results: {result[:3] if result else []}")

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "success": True,
                    "result": list(map(lambda x: x.model_dump_json(), result)),
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
