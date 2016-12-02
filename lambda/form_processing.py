import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)   #TODO: Change this when we're in production

def process_message(message):
    # Processes the message content prior to DB push
    body = json.loads(message.body)
    processed = {}
    
    logger.info('Processing message')

    for section, product in body['aws_services'].iteritems():
        body['aws_services'][section] = dict((k, v) for k, v in product.iteritems() if v != False) #TODO: Handle mixed case (Defensive coding)
        processed = body['customer_details']
        processed['aws_services'] = body['aws_services']
    return processed

def datastore_push(message):
    # Pushes processed data structs to the datastore of choice
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('SimpleBuilds')
    try:
        response = table.put_item(Item=message)
        return response
    except:
        logger.error('Error connecting to DynamoDB')
        return False

def message_consumer(event, context):
    # Consumes messages from the SQS queue
    logger.info('Message consumer started...')
    sqs = boto3.resource('sqs')
    queue = sqs.get_queue_by_name(QueueName='simple-build-queue')
    msg_pending = True  # We have to set a flag here because SQS only returns a single message 
    while msg_pending:
        try: 
            messages = queue.receive_messages()
        except:
            logger.error("Unexpected error - SQS queue recieve_messages")
            return False
        
        for msg in messages:    # At some point SQS might return more than one message
            logger.info('Consuming message from queue.')
            response = process_message(msg)
            if response:    
                logger.info('Pushing to DynamoDB')
                if datastore_push(response):
                    logger.info('Push successful - Deleting message from queue...')
                    msg.delete()
                else:
                    logger.error('Unable to push message to DynammoDB table')
            else:
                logger.error('Encountered an error ' % (response))
        else:
            msg_pending = False
    return 'All messages consumed - Om nom nom'