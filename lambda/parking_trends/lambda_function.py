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
        SELECT * FROM staging_parking_trends
    """
    cursor.execute(query)

    # Form json by result
    result = cursor.fetchall()
    table_data = []
    for row in result:
        table_data.append({
            'Year': row[0], 
            'Present': row[1], 
            'Unoccupied': row[2], 
            'Total_Sensors': row[3], 
            'Occupancy_Rate': row[4]
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