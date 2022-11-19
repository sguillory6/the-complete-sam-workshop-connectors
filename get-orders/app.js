const {DynamoDBClient } = require ( "@aws-sdk/client-dynamodb" );
const {DynamoDBDocumentClient, ScanCommand} = require ( "@aws-sdk/lib-dynamodb" );

const client = new DynamoDBClient({ region: "us-west-2", endpoint: "http://local-dynamodb:8000" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
let response;

// Set the parameters.
const params = {
    ProjectionExpression: "Id, sku, product, quantity",
    TableName: process.env.TABLE_NAME,
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
    try {
        const items = await ddbDocClient.send(new ScanCommand(params));
        const result = JSON.stringify(items)
        response = {
            'statusCode': 200,
            'body': result
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    return response
};
