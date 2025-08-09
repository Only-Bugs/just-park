import pymysql
import json

# DB Config
endpoint = 'parking-db-prod.cziu20u0uide.ap-southeast-2.rds.amazonaws.com'
username = 'admin'
password = 'ParkingDB2025!'
database_name = 'parking_db'

def lambda_handler(event, context):
    connection = None
    cursor = None
    total_processed = 0
    
    try:
        # Connect to database
        connection = pymysql.connect(
            host=endpoint,
            user=username,
            passwd=password,
            db=database_name,
            autocommit=False,
            connect_timeout=10
        )
        cursor = connection.cursor()
        
        # Process SQS records
        for record in event['Records']:
            try:
                # Parse the message
                message_body = json.loads(record['body'])
                parking_records = message_body['records']
                
                print(f"Processing {len(parking_records)} records from SQS")
                
                # Insert each parking record
                for row in parking_records:
                    # Debug: print the row structure
                    print(f"Row structure: {row}")
                    
                    # Extract values and convert to strings/None
                    lastupdated = row.get("lastupdated")
                    status_time = row.get("status_time") 
                    zone_number = row.get("zone_number")
                    status_description = row.get("status_description")
                    bay_id = row.get("bay_id")
                    location = row.get("location")
                    
                    # Handle location if it's a dict (common in APIs)
                    if isinstance(location, dict):
                        location = json.dumps(location)  # Convert dict to JSON string
                    
                    # Handle any other potential dict values
                    if isinstance(lastupdated, dict):
                        lastupdated = str(lastupdated)
                    if isinstance(status_time, dict):
                        status_time = str(status_time)
                    if isinstance(status_description, dict):
                        status_description = str(status_description)
                    
                    print(f"Inserting: bay_id={bay_id}, zone={zone_number}, status={status_description}")
                    
                    cursor.execute("""
                        INSERT INTO staging_parking_sensors 
                        (Lastupdated, Status_Timestamp, Zone_Number, Status_Description, KerbsideID, Location)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE
                            Lastupdated = VALUES(Lastupdated),
                            Status_Timestamp = VALUES(Status_Timestamp),
                            Status_Description = VALUES(Status_Description),
                            Location = VALUES(Location)
                    """, (
                        lastupdated,
                        status_time,
                        zone_number,
                        status_description,
                        bay_id,
                        location
                    ))
                    total_processed += 1
                
                # Commit after each SQS message
                connection.commit()
                print(f"Committed {len(parking_records)} records")
                
                # Verify insertion with a count query
                cursor.execute("SELECT COUNT(*) FROM staging_parking_sensors")
                total_count = cursor.fetchone()[0]
                print(f"Total records in database: {total_count}")
                
            except Exception as e:
                print(f"Error processing SQS record: {str(e)}")
                connection.rollback()
                raise e
        
        return {
            "statusCode": 200,
            "body": json.dumps(f"Processed {total_processed} records")
        }
        
    except Exception as e:
        print(f"Lambda error: {str(e)}")
        if connection:
            connection.rollback()
        raise e
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()