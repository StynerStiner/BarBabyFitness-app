// src/lib/aws/config.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Check if AWS credentials are available
const hasAwsCredentials = !!(
  import.meta.env.VITE_AWS_ACCESS_KEY_ID && 
  import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
);

// Log credential status (without revealing secrets)
console.log('AWS credentials status:', hasAwsCredentials ? 'Available' : 'Missing');

export const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  // Only include credentials if they're actually available
  ...(hasAwsCredentials && {
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    }
  })
};

export const DYNAMO_CONFIG = {
  tableName: 'barbaby_content'  // This matches our created table name
};

// Initialize DynamoDB client only if credentials are available
let dynamoDbClient;
try {
  const client = new DynamoDBClient(AWS_CONFIG);
  dynamoDbClient = DynamoDBDocumentClient.from(client);
} catch (error) {
  console.warn('Failed to initialize DynamoDB client:', error);
  // Create a mock client that will be gracefully handled by the service layer
  dynamoDbClient = {
    send: () => {
      throw new Error('DynamoDB client not properly initialized due to missing credentials');
    }
  };
}

export const dynamoDb = dynamoDbClient;