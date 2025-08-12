#!/bin/bash

# AWS Lambda部署脚本

echo "🚀 开始部署AWS Lambda API..."

# 检查AWS CLI是否安装
if ! command -v aws &> /dev/null; then
    echo "❌ 错误: AWS CLI未安装"
    echo "请安装AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# 检查是否配置了AWS凭证
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ 错误: AWS凭证未配置"
    echo "请运行: aws configure"
    exit 1
fi

# 设置变量
FUNCTION_NAME="parking-dashboard-api"
REGION="ap-southeast-2"  # 与你的RDS相同的区域
ROLE_NAME="lambda-parking-api-role"

echo "📦 准备Lambda部署包..."

# 创建临时目录
mkdir -p lambda-package
cd lambda-package

# 复制Lambda函数代码
cp ../lambda/parking-api.py .
cp ../lambda/requirements.txt .

# 安装依赖
echo "📥 安装Python依赖..."
pip install -r requirements.txt -t .

# 创建部署包
echo "📦 创建部署包..."
zip -r ../parking-api.zip .

# 返回上级目录
cd ..

# 清理临时目录
rm -rf lambda-package

echo "☁️ 部署到AWS Lambda..."

# 检查IAM角色是否存在
if ! aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
    echo "🔐 创建IAM角色..."
    
    # 创建信任策略
    cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # 创建角色
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file://trust-policy.json

    # 附加基本执行策略
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    # 等待角色创建完成
    sleep 10
    
    # 清理临时文件
    rm trust-policy.json
fi

# 获取角色ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)

# 检查Lambda函数是否存在
if aws lambda get-function --function-name $FUNCTION_NAME > /dev/null 2>&1; then
    echo "🔄 更新现有Lambda函数..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://parking-api.zip
else
    echo "🆕 创建新Lambda函数..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime python3.9 \
        --role $ROLE_ARN \
        --handler parking-api.lambda_handler \
        --zip-file fileb://parking-api.zip \
        --timeout 30 \
        --memory-size 256
fi

# 清理部署包
rm parking-api.zip

echo "🌐 创建API Gateway..."

# 这里需要手动创建API Gateway，因为CLI命令比较复杂
echo "⚠️  请手动完成以下步骤:"
echo "1. 登录AWS控制台"
echo "2. 进入API Gateway服务"
echo "3. 创建新的REST API"
echo "4. 创建资源和方法"
echo "5. 集成Lambda函数: $FUNCTION_NAME"
echo "6. 部署API并获取调用URL"
echo "7. 更新js/dashboard.js中的apiBaseUrl"

echo "✅ Lambda函数部署完成!"
echo "函数名: $FUNCTION_NAME"
echo "区域: $REGION"