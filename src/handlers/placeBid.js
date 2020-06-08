import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
import middleware from '../middlewares';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    );
  }
  if (auction.status == 'CLOSED') {
    throw new createError.Forbidden(`Auction is Closed`);
  }
  const params = {
    TableName: process.env.AUCTION_TABLE,
    Key: { id },
    UpdateExpression: 'set highestBid.amount= :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedAuction;
  try {
    const result = await db.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middleware(placeBid);
