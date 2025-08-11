import boto3
import json
import requests

# Configure SQS client
sqs = boto3.client('sqs')
sqs_URL = "https://sqs.ap-southeast-2.amazonaws.com/561616501799/ParkingBaySensorQueue"
sensor_API = "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/on-street-parking-bay-sensors/records"

def lambda_handler(event, context):
    # Fetch city of melbourne sensor API
    offset = 0
    limit = 50
    total_sent = 0

    while True:
        params = {
            "limit": limit,
            "offset": offset
        }
        try:
            response = requests.get(sensor_API, params=params, timeout=30)
            response.raise_for_status()
            data = response.json().get("results", [])
            
            if not data:
                break
            
            # Send batch to SQS
            message_body = {
                "records": data,
                "offset": offset,
                "batch_size": len(data)
            }
            
            sqs.send_message(
                QueueUrl=sqs_URL,
                MessageBody=json.dumps(message_body)
            )
            
            total_sent += len(data)
            print(f"Sent batch of {len(data)} records (offset: {offset})")
            
            offset += limit
            
            # Safety limit
            if offset > 50000:
                break
                
        except Exception as e:
            print(f"Error at offset {offset}: {str(e)}")
            break
    
    return {
        "statusCode": 200,
        "body": json.dumps(f"Sent {total_sent} records to queue")
    }
