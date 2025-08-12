import json
import pymysql
import os
from datetime import datetime

# AWS RDS连接配置
RDS_HOST = "parking-db-prod.cziu20u0uide.ap-southeast-2.rds.amazonaws.com"
RDS_PORT = 3306
RDS_DB = "parking_db"
RDS_USER = "admin"
RDS_PASSWORD = "ParkingDB2025!"

def lambda_handler(event, context):
    """
    AWS Lambda函数处理API请求
    """
    
    # 启用CORS
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
    
    # 处理OPTIONS请求（CORS预检）
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight'})
        }
    
    try:
        # 连接数据库
        connection = pymysql.connect(
            host=RDS_HOST,
            port=RDS_PORT,
            user=RDS_USER,
            password=RDS_PASSWORD,
            database=RDS_DB,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        # 获取路径参数
        path = event.get('path', '/')
        
        if path == '/restrictions' or path == '/prod/restrictions':
            data = get_restrictions_data(connection)
        elif path == '/stats' or path == '/prod/stats':
            data = get_stats_data(connection)
        elif path == '/zones' or path == '/prod/zones':
            data = get_zones_data(connection)
        else:
            data = {'error': 'Invalid endpoint'}
            
        connection.close()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(data, default=str)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def get_restrictions_data(connection):
    """获取停车限制数据"""
    try:
        with connection.cursor() as cursor:
            # 从你的restrictions表获取数据
            sql = """
            SELECT zone_id, days, start_time, end_time, rule 
            FROM restrictions 
            LIMIT 100
            """
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    except Exception as e:
        print(f"Error getting restrictions data: {str(e)}")
        return []

def get_stats_data(connection):
    """获取统计数据"""
    try:
        with connection.cursor() as cursor:
            # 获取总区域数
            cursor.execute("SELECT COUNT(DISTINCT zone_id) as total_zones FROM restrictions")
            zones_result = cursor.fetchone()
            
            # 获取总限制数
            cursor.execute("SELECT COUNT(*) as total_restrictions FROM restrictions")
            restrictions_result = cursor.fetchone()
            
            return {
                'totalZones': zones_result['total_zones'] if zones_result else 0,
                'totalRestrictions': restrictions_result['total_restrictions'] if restrictions_result else 0,
                'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
    except Exception as e:
        print(f"Error getting stats data: {str(e)}")
        return {
            'totalZones': 0,
            'totalRestrictions': 0,
            'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

def get_zones_data(connection):
    """获取区域数据"""
    try:
        with connection.cursor() as cursor:
            sql = """
            SELECT zone_id, COUNT(*) as restriction_count,
                   GROUP_CONCAT(DISTINCT rule) as rules
            FROM restrictions 
            GROUP BY zone_id 
            ORDER BY zone_id
            LIMIT 50
            """
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
    except Exception as e:
        print(f"Error getting zones data: {str(e)}")
        return []