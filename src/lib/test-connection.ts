// src/lib/aws/test-connection.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// Mock AWS_CONFIG for testing purposes
const AWS_CONFIG = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'mockAccessKeyId',
    secretAccessKey: 'mockSecretAccessKey',
  },
};

export async function testConnection() {
  try {
    const client = new DynamoDBClient(AWS_CONFIG);
    await client.config.credentials();
    console.log('AWS credentials loaded successfully');
    return true;
  } catch (error) {
    console.error('AWS connection test failed:', error);
    return false;
  }
}