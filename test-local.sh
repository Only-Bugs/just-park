#!/bin/bash

# 本地测试脚本

echo "🧪 启动本地测试服务器..."
echo "=========================="
echo ""

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 错误: Python未安装"
    exit 1
fi

echo "✅ 使用 $PYTHON_CMD"
echo ""

# 检查必要文件
if [ ! -f "index.html" ]; then
    echo "❌ 错误: index.html文件不存在"
    exit 1
fi

if [ ! -f "js/dashboard.js" ]; then
    echo "❌ 错误: js/dashboard.js文件不存在"
    exit 1
fi

echo "✅ 所有必要文件存在"
echo ""

# 启动服务器
echo "🚀 启动本地服务器在端口 8000..."
echo "📱 访问: http://localhost:8000"
echo ""
echo "💡 提示:"
echo "   - 由于没有API连接，将显示示例数据"
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 部署到GitHub Pages后将连接真实数据"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "===================="

$PYTHON_CMD -m http.server 8000