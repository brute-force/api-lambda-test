# api-lambda-test

Simple website scraper demo using containerized AWS Lambda, API Gateway, S3, and Cognito User Pool Authorizer.

- lambda - Typescript code for the application's Lambda function
- lambda/tests - Unit tests
- events - Invocation events
- template.yaml - SAM template that defines the application's AWS resources


## Deploy 

```bash
sam build --beta-features
sam deploy --g
```


## Test locally

```bash
api-lambda-test$ sam local invoke ScraperFunction --event events/event.json
```

```bash
api-lambda-test$ sam local start-api
```


## Fetch, tail, and filter Lambda function logs

```bash
api-lambda-test$ sam logs -n ScraperFunction --stack-name api-lambda-test --tail
```


## Unit tests

```bash
api-lambda-test$ cd lambda
lambda$ npm install
lambda$ npm run test
```


## Cleanup

```bash
aws cloudformation delete-stack --stack-name api-lambda-test
```