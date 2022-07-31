import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Input, Output } from './interfaces';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const BUCKET = 'lambda-url-to-html-storage';
const s3Client = new S3Client({ region: 'us-east-1' });

const storeHtmlFile = async (content: string, name: string): Promise<string> => {
  const key = `${name}.html`;
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: Buffer.from(content),
    ContentType: 'text/html'
  });

  await s3Client.send(cmd);
  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error);
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = { statusCode: 200, body: '' };
  const output: Output = { title: '', s3_url: '', error: '' };

  try {
    const eventBody = event.queryStringParameters as object as Input;

    if (!eventBody.name || !eventBody.url) {
      throw Error('name and url are required.');
    }

    console.log(JSON.stringify(eventBody));

    const res = await axios.get(eventBody.url);
    output.title = cheerio.load(res.data)('head > title').text().trim();
    output.s3_url = await storeHtmlFile(res.data, eventBody.name);
  } catch (err) {
    response.statusCode = 500;
    output.error = getErrorMessage(err);
  }

  response.body = JSON.stringify(output);
  console.log(JSON.stringify(response));

  return response;
};
