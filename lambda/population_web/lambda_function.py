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
        SELECT * FROM staging_population_web
    """
    cursor.execute(query)

    # Form json by result
    result = cursor.fetchall()
    table_data = []
    for row in result:
        table_data.append({
            'S/T code': row[0], 
            'S/T name': row[1], 
            'GCCSA code': row[2], 
            'GCCSA name': row[3], 
            'SA4 code': row[4], 
            'SA4 name': row[5], 
            '2015': row[6], 
            '2016': row[7], 
            '2017': row[8], 
            '2018': row[9], 
            '2019': row[10], 
            '2020': row[11], 
            '2021': row[12]
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