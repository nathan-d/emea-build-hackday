import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)   #TODO: Change this when we're in production

def process_message(message):
    # Processes the message content prior to DB push
    body = json.loads(message.body)
    processed = {}
    for section, product in body['aws_services'].iteritems():
        body['aws_services'][section] = dict((k, v) for k, v in product.iteritems() if v != False) #TODO: Handle mixed case (Defensive coding)
        processed = body['customer_details']
        processed['aws_services'] = body['aws_services']
        print processed
    return processed

def datastore_push(message):
    # Pushes processed data structs to the datastore of choice
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('SimpleBuilds')
    try:
        response = table.put_item(Item=message)
        return response
    except:
        print "Unexpected error"
        return False

def message_consumer(event, context):
    # Consumes messages from the SQS queue
    logger.info('Message consumer started...')
    sqs = boto3.resource('sqs')
    queue = sqs.get_queue_by_name(QueueName='simple-build-queue')
    msg_pending = True
    while msg_pending:  #TODO: We really need to clean this up
        msg = queue.receive_messages() #TODO: Fix the fucking looping shizzle
        if msg:
            msg = msg[0]    #TODO: Need to handle more than one element for when AWS fix SQS
            logger.info('Consuming message from queue.')
            response = process_message(msg)
            if response:
                # Push to datastore
                logger.info('Pushing to DynamoDB')
                datastore_push(response)
                logger.info('Push successful - Deleting message from queue...')
                msg.delete()
            else:
                logger.error('Encountered an error ' % (response))
        else:
            msg_pending = False
    return 'All messages consumed - Om nom nom'