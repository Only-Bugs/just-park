#!/bin/bash
set -e

# Configuration - UPDATE THE DOMAIN NAME
DOMAIN="justpark"
BUCKET_NAME="$DOMAIN"
REGION="us-east-1"

echo "🚀 Starting deployment for $DOMAIN..."

# Build the application
echo "📦 Building application..."
pnpm build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build successful - dist directory found"

# Create S3 bucket
echo "☁️ Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"

# Enable static website hosting
echo "🌐 Enabling static website hosting..."
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public access
echo "🔓 Setting bucket policy for public access..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Upload files
echo "📤 Uploading files..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# Clean up
rm bucket-policy.json

echo "✅ Deployment complete!"
echo "🌐 Your site is available at: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"