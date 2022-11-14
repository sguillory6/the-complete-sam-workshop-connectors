import boto3
import argparse

def delete_table(table_name, dyn_resource=None):
    """
    Deletes the demonstration table.

    :param dyn_resource: Either a Boto3 or DAX resource.
    """
    if dyn_resource is None:
        dyn_resource = boto3.resource('dynamodb')

    table = dyn_resource.Table(table_name)
    table.delete()

    print(f"Deleting {table.name}...")
    table.wait_until_not_exists()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'Delete the given DynamoDB table')
#     parser.add_argument("-t", "--table-name", help = "Name of table to delete")
    parser.add_argument('table')
    args = parser.parse_args()

    print(args.table)
    print("The table to delete: " + args.table)
    delete_table(args.table)
    print("Table deleted!")