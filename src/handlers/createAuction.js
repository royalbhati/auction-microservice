import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
import middleware from '../middlewares';
import createError from 'http-errors';
import validator from '@middy/validator';
import createAuctionSchema from '../schemas/createAuctionSchema';

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingDate: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await db
      .put({
        TableName: process.env.AUCTION_TABLE,
        Item: auction,
      })
      .promise();
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middleware(createAuction).use(
  validator({ inputSchema: createAuctionSchema })
);
