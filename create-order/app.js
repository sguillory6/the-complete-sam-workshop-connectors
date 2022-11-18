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
        const order = JSON.parse(event.body)

        await docClient.put({
            TableName: process.env.TABLE_NAME,
            Item: {
                PK: parseInt(order.id),
                sku: order.sku,
                product: order.product,
                quantity: order.quantity
            }
        }).promise();
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'order saved'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
