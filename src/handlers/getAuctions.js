import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
import middleware from '../middlewares';

import createError from 'http-errors';

async function getAuctions(event, context) {
  let auctions;
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTION_TABLE,
    IndexName: 'statusANDEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };
  try {
    const result = await db.query(params).promise();
    auctions = result.Items;
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middleware(getAuctions);
