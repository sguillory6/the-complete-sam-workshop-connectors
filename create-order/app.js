const {DynamoDBClient } = require ( "@aws-sdk/client-dynamodb" );
const {DynamoDBDocumentClient, PutCommand} = require ( "@aws-sdk/lib-dynamodb" );

const client = new DynamoDBClient({ region: "us-west-2", endpoint: "http://local-dynamodb:8000" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
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

        // Set the parameters.
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                Id: parseInt(order.id),
                sku: order.sku,
                product: order.product,
                quantity: order.quantity
            },
        };

        console.log("Table Name: " + process.env.TABLE_NAME);
        await ddbDocClient.send(new PutCommand(params));
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
