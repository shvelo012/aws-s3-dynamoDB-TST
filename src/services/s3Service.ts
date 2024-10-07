import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { IS3Service } from "../interfaces/IS3Service";
import { config } from "dotenv";

config();

export class S3Service implements IS3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  private bucketName = process.env.S3_BUCKET_NAME!;

  async uploadFile(key: string, body: Buffer): Promise<void> {

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
    });

    try {
      await this.s3.send(command);
      console.log(`File uploaded successfully: ${key}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(`Could not upload file to S3: ${error}`);
    }
  }

  async updateFile(key: string, body: Buffer): Promise<void> {
    console.log("Updating file in S3...");
    
    try {
      await this.uploadFile(key, body);
      console.log(`File updated successfully: ${key}`);
    } catch (error) {
      console.error("Error updating file:", error);
      throw new Error(`Could not update file in S3: ${error}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    console.log("Deleting file from S3...");

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3.send(command);
      console.log(`File deleted successfully: ${key}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error(`Could not delete file from S3: ${error}`);
    }
  }
}
