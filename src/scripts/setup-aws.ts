// src/lib/aws/schema.ts
import { ScalarAttributeType } from "@aws-sdk/client-dynamodb";

export interface AWSConfig {
  region: string;
  tables: {
    MEMBERS: string;
    HEALTH_RECORDS: string;
    EMERGENCY_CONTACTS: string;
    REGISTRATIONS: string;
    DOCUMENTS: string;
    PAYMENTS: string;
  };
  buckets: {
    LEGAL_DOCS: string;
    SIGNATURES: string;
  };
}

export const awsConfig: AWSConfig = {
  region: 'us-east-1',
  tables: {
    MEMBERS: 'barbaby-members',
    HEALTH_RECORDS: 'barbaby-health-records',
    EMERGENCY_CONTACTS: 'barbaby-emergency-contacts',
    REGISTRATIONS: 'barbaby-registrations',
    DOCUMENTS: 'barbaby-documents',
    PAYMENTS: 'barbaby-payments'
  },
  buckets: {
    LEGAL_DOCS: 'barbaby-legal-documents',
    SIGNATURES: 'barbaby-signatures'
  }
};

// DynamoDB Table Schemas
export const TableSchemas = {
  Members: {
    TableName: awsConfig.tables.MEMBERS,
    KeySchema: [
      { AttributeName: 'memberId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'memberId', AttributeType: 'S' as ScalarAttributeType },
      { AttributeName: 'email', AttributeType: 'S' as ScalarAttributeType }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'email-index',
      KeySchema: [
        { AttributeName: 'email', KeyType: 'HASH' }
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  HealthRecords: {
    TableName: awsConfig.tables.HEALTH_RECORDS,
    KeySchema: [
      { AttributeName: 'memberId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'memberId', AttributeType: 'S' as ScalarAttributeType }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  EmergencyContacts: {
    TableName: awsConfig.tables.EMERGENCY_CONTACTS,
    KeySchema: [
      { AttributeName: 'memberId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'memberId', AttributeType: 'S' as ScalarAttributeType }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  Registrations: {
    TableName: awsConfig.tables.REGISTRATIONS,
    KeySchema: [
      { AttributeName: 'registrationId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'registrationId', AttributeType: 'S' as ScalarAttributeType },
      { AttributeName: 'memberId', AttributeType: 'S' as ScalarAttributeType }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'member-index',
      KeySchema: [
        { AttributeName: 'memberId', KeyType: 'HASH' }
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

// S3 Bucket Configurations (unchanged)
export const BucketConfigs = {
  LegalDocs: {
    Bucket: awsConfig.buckets.LEGAL_DOCS,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ['*'],
        AllowedMethods: ['PUT', 'POST', 'GET'],
        AllowedOrigins: ['*'], // Restrict to your domain in production
        ExposeHeaders: ['ETag']
      }]
    }
  },
  Signatures: {
    Bucket: awsConfig.buckets.SIGNATURES,
    CORSConfiguration: {
      CORSRules: [{
        AllowedHeaders: ['*'],
        AllowedMethods: ['PUT', 'POST', 'GET'],
        AllowedOrigins: ['*'], // Restrict to your domain in production
        ExposeHeaders: ['ETag']
      }]
    }
  }
};