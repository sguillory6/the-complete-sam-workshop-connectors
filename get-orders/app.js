const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({endpointURL: 'http://localhost:8000'});
let response;

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
        let items = await docClient.scan({
            TableName: process.env.TABLE_NAME,
        }).promise();
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
