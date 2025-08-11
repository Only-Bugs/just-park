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
            zs.zone_id, 
            zs.on_street, 
            zs.street_from, 
            zs.street_to, 
            zs.segment_id,
            pz.Occupancy_Rate_Percent, 
            pz.Total_Readings,
            pb.lat,
            pb.lon
        FROM staging_zone_segments zs
        LEFT JOIN staging_parking_zones pz
            ON CAST(zs.zone_id AS UNSIGNED) = CAST(pz.Zone_Number AS UNSIGNED)
        LEFT JOIN staging_parking_bays pb
            ON zs.segment_id = pb.segment_id;
    """
    cursor.execute(query)

    # Form json by result
    result = cursor.fetchall()
    table_data = []
    for row in result:
        table_data.append({
            'zone_id': row[0],
            'on_street': row[1],
            'street_from': row[2],
            'street_to': row[3],
            'segment_id': row[4],
            'occupancy_rate_percent': row[5],
            'total_readings': row[6],
            'lat': row[7],
            'lon': row[8]
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
