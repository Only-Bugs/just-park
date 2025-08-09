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
        SELECT * FROM motor_vehicle_census
    """
    cursor.execute(query)

    # Form json by result
    result = cursor.fetchall()
    table_data = []
    for row in result:
        table_data.append({
            'census_id': row[0], 
            'state': row[1], 
            'year_2016_2017': row[2], 
            'year_2016_2017_attrition_rate': row[3], 
            'year_2017_2018': row[4], 
            'year_2017_2018_attrition_rate': row[5], 
            'year_2018_2019': row[6], 
            'year_2018_2019_attrition_rate': row[7], 
            'year_2019_2020': row[8], 
            'year_2019_2020_attrition_rate': row[9], 
            'year_2020_2021': row[10], 
            'year_2020_2021_attrition_rate': row[11]
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