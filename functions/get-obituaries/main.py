# add your get-obituaries function here
import boto3
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("LS-ob-30143419")
def handler(event, context):
    try:
        response = table.scan()
        items = response.get('Items', [])
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items += response.get('Items', [])
        return items
    except Exception as e:
        print(f"Error: {e}")
        raise e
