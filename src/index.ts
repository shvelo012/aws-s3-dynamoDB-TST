import { config } from 'dotenv';
import { S3Service } from './services/s3Service';
import { DynamoService } from './services/dynamoService';


const s3Service = new S3Service();
const dynamoService = new DynamoService();

async function run() {
  try {
    const fileKey = 'test-file.txt';
    const fileBody = Buffer.from('Hello, world!');

    await s3Service.uploadFile(fileKey, fileBody);
    await dynamoService.createRecord('1', fileKey, fileBody.length);

    console.log('File uploaded and DynamoDB record created');
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

run();
