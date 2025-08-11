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
        LEFT JOIN parking_restrictions_clean_v r
            ON CAST(ps.Zone_Number AS UNSIGNED) = CAST(r.zone_id AS UNSIGNED)
    """
    cursor.execute(query)
    result = cursor.fetchall()

    grouped = {}
    for row in result:
        kerb_id = row[4]
        restriction = {
            'Days': row[6],
            'Start_Time': str(row[7]) if row[7] is not None else None,
            'End_Time': str(row[8]) if row[8] is not None else None,
            'Rule': row[9]
        }
        if kerb_id not in grouped:
            grouped[kerb_id] = {
                'Lastupdated': str(row[0]) if row[0] else None,
                'Status_Timestamp': str(row[1]) if row[1] else None,
                'Zone_Number': row[2],
                'Status_Description': row[3],
                'KerbsideID': row[4],
                'Location': row[5],
                'Restrictions': []
            }
        grouped[kerb_id]['Restrictions'].append(restriction)

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
        'body': list(grouped.values())
    }
