import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { AWS_CONFIG } from './config';

const client = new DynamoDBClient(AWS_CONFIG);
export const dynamoDb = DynamoDBDocumentClient.from(client);
