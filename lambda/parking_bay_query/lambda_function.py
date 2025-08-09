import pymysql
import json

# Configuration
endpoint = 'parking-db-prod.cziu20u0uide.ap-southeast-2.rds.amazonaws.com'
username = 'admin'
password = 'ParkingDB2025!'
database_name = 'parking_db'

def lambda_handler(event, context):
    # Connection
    connection = pymysql.connect(host=endpoint, user=username, passwd=password, db=database_name)

    # Query
    cursor = connection.cursor()
    query = """
        SELECT 
            ps.Lastupdated,
            ps.Status_Timestamp,
            ps.Zone_Number,
            ps.Status_Description,
            ps.KerbsideID,
            ps.Location,
            r.days,
            r.start_time,
            r.end_time,
            r.rule
        FROM staging_parking_sensors ps
        LEFT JOIN staging_restrictions r
            ON CAST(ps.Zone_Number AS UNSIGNED) = CAST(r.zone_id AS UNSIGNED)
    """
    cursor.execute(query)

    # Form json by result
    result = cursor.fetchall()
    table_data = []
    for row in result:
        table_data.append({
            'Lastupdated': row[0], 
            'Status_Timestamp': row[1], 
            'Zone_Number': row[2], 
            'Status_Description': row[3], 
            'KerbsideID': row[4], 
            'Location': row[5],
            'Days': row[6],
            'Start_Time': row[7],
            'End_Time': row[8],
            'Rule': row[9]
        })

    cursor.close()
    connection.close()

    # Response
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': table_data
    }
