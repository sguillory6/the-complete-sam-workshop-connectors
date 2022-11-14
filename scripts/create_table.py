import boto3
import argparse

def create_table(table_name, dyn_resource=None):
    """
    Creates a DynamoDB table.

    :param dyn_resource: Either a Boto3 or DAX resource.
    :return: The newly created table.
    """
    if dyn_resource is None:
        dyn_resource = boto3.resource('dynamodb')

    params = {
        'TableName': table_name,
        'KeySchema': [
            {'AttributeName': 'PK', 'KeyType': 'HASH'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'PK', 'AttributeType': 'N'}
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    }
    table = dyn_resource.create_table(**params)
    print(f"Creating {table_name}...")
    table.wait_until_exists()
    return table

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'Delete the given DynamoDB table')
#     parser.add_argument("-t", "--table-name", help = "Name of table to delete")
    parser.add_argument('table')
    args = parser.parse_args()

    print(args.table)
    print("The table to create: " + args.table)
    create_table(args.table)
    print("Table created!")