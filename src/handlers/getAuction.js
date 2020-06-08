import AWS from 'aws-sdk';
const db = new AWS.DynamoDB.DocumentClient();
import middleware from '../middlewares';
import createError from 'http-errors';

export const getAuctionById = async (id) => {
  let auction;
  try {
    const result = await db
      .get({
        TableName: process.env.AUCTION_TABLE,
        Key: { id },
      })
      .promise();
    console.log(result.Item);
    auction = result.Item;
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
  if (!auction) {
    throw new createError.NotFound(`Auction with ${id} not found`);
  }
  return auction;
};

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middleware(getAuction);
