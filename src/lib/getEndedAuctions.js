import AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();

  const params = {
    TableName: process.env.AUCTION_TABLE,
    IndexName: 'statusANDEndDate',
    KeyConditionExpression: '#status= :status AND endingDate <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };
  const result = await db.query(params).promise();
  return result.Items;
}
