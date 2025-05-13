import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AWS_CONFIG } from './config';

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
