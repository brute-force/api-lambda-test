import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { describe, it, expect } from '@jest/globals';

describe('Unit test for app handler', function () {
  it('verifies successful response', async () => {
    const name = 'Zerohedge';
    const url = 'https://www.zerohedge.com/';

    const event: APIGatewayProxyEvent = {
      httpMethod: 'get',
      body: '',
      headers: {},
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      path: '/scrape',
      pathParameters: {},
      queryStringParameters: {
        name,
        url
        // name: 'Zerohedge',
        // url: 'https://www.zerohedge.com/'
      },
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'get',
        identity: {
          accessKey: '',
          accountId: '',
          apiKey: '',
          apiKeyId: '',
          caller: '',
          clientCert: {
            clientCertPem: '',
            issuerDN: '',
            serialNumber: '',
            subjectDN: '',
            validity: { notAfter: '', notBefore: '' }
          },
          cognitoAuthenticationProvider: '',
          cognitoAuthenticationType: '',
          cognitoIdentityId: '',
          cognitoIdentityPoolId: '',
          principalOrgId: '',
          sourceIp: '',
          user: '',
          userAgent: '',
          userArn: ''
        },
        path: '/scrape',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/scrape',
        stage: 'dev'
      },
      resource: '',
      stageVariables: {}
    };
    const result: APIGatewayProxyResult = await lambdaHandler(event);
    // console.log(JSON.stringify(result));

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        title: name,
        s3_url: `https://lambda-url-to-html-storage.s3.amazonaws.com/${name}.html`,
        error: ''
      })
    );
  });
});
