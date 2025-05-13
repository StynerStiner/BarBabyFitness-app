// src/scripts/test-tables.mts
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });

async function testTables() {
  try {
    const memberId = uuidv4();
    const registrationId = uuidv4();
    const testEmail = "test@example.com";

    console.log("Testing barbaby-members table...");
    await dynamoDB.send(new PutItemCommand({
      TableName: "barbaby-members",
      Item: {
        memberId: { S: memberId },
        email: { S: testEmail },
        firstName: { S: "Test" },
        lastName: { S: "User" },
      },
    }));

    // Query the 'email-index'
    const emailQuery = await dynamoDB.send(new QueryCommand({
      TableName: "barbaby-members",
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: testEmail },
      },
    }));
    console.log("Email index query result:", emailQuery);

    console.log("All table tests completed successfully!");
    console.log("Test member ID:", memberId);
    console.log("Test registration ID:", registrationId);
  } catch (error) {
    console.error("Error during table testing:", error);
  }
}

testTables();
