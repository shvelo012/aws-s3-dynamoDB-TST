import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { IDynamoService } from "../interfaces/IDynamoService";
import { config } from "dotenv";

config();

export class DynamoService implements IDynamoService {
  private dynamo: DynamoDBClient;
  private tableName: string;

  constructor() {
    const region = process.env.AWS_REGION!;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
    this.tableName = process.env.DYNAMO_TABLE_NAME!;

    this.dynamo = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async createRecord(id: string, name: string, size: number): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        Id: { S: id },
        createdAt: { S: new Date().toISOString() },
        name: { S: name },
        size: { N: size.toString() },
      },
    });

    try {
      await this.dynamo.send(command);
    } catch (error) {
      console.error("Error creating record:", error);
      throw new Error("Could not create record in DynamoDB");
    }
  }

  async updateRecord(id: string, size: number): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { Id: { S: id } },
      UpdateExpression: "set size = :size",
      ExpressionAttributeValues: { ":size": { N: size.toString() } },
    });

    try {
      await this.dynamo.send(command);
    } catch (error) {
      console.error("Error updating record:", error);
      throw new Error("Could not update record in DynamoDB");
    }
  }

  async deleteRecord(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: { Id: { S: id } },
    });

    try {
      await this.dynamo.send(command);
    } catch (error) {
      console.error("Error deleting record:", error);
      throw new Error("Could not delete record in DynamoDB");
    }
  }
}
