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
    records_updated = 0
    records_not_found = 0
    
    try:
        # Connection
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
                
                # Update each parking record
                for row in parking_records:
                    # Extract values
                    lastupdated = row.get("lastupdated")
                    status_time = row.get("status_timestamp")
                    zone_number = row.get("zone_number")
                    status_description = row.get("status_description")
                    bay_id = row.get("kerbsideid")
                    location_data = row.get("location")
                    
                    # Convert location from {"lon": x, "lat": y} to "lat, lon" string format
                    location_string = None
                    if isinstance(location_data, dict) and 'lat' in location_data and 'lon' in location_data:
                        location_string = f"{location_data['lat']}, {location_data['lon']}"
                    elif location_data:
                        location_string = str(location_data)
                    
                    # Update record
                    cursor.execute("""
                        UPDATE staging_parking_sensors 
                        SET 
                            Lastupdated = %s,
                            Status_Timestamp = %s,
                            Zone_Number = %s,
                            Status_Description = %s,
                            Location = %s
                        WHERE KerbsideID = %s
                    """, (
                        lastupdated,
                        status_time,
                        zone_number,
                        status_description,
                        location_string,
                        bay_id
                    ))
                    
                    # Checker
                    if cursor.rowcount > 0:
                        records_updated += 1
                        print(f"Successfully updated KerbsideID {bay_id}")
                    else:
                        records_not_found += 1
                        print(f"No existing record found for KerbsideID {bay_id}")
                    
                    total_processed += 1
                
                # Commit after each SQS message
                connection.commit()
                print(f"Committed updates for {len(parking_records)} records")
                
            except Exception as e:
                print(f"Error processing SQS record: {str(e)}")
                connection.rollback()
                raise e
        
        # Summary
        print(f"Summary: {total_processed} processed, {records_updated} updated, {records_not_found} not found")
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": f"Processed {total_processed} records",
                "updated": records_updated,
                "not_found": records_not_found
            })
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