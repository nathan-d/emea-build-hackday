import boto3

def lambda_handler(event, context):

    client = boto3.client('dynamodb')

    for record in event['Records']:
        # your logic here...
        try:
            client.update_item(TableName='dan-testing-table', Key={'hash_key':{'N':'value'}}, AttributeUpdates={"some_key":{"Action":"PUT","Value":{"N":'value'}}}) 
        except Exception, e:
            print (e)