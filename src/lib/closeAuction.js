import AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export async function closeAuction({ id }) {
  const params = {
    TableName: process.env.AUCTION_TABLE,
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const result = await db.update(params).promise();
  return result;
}
