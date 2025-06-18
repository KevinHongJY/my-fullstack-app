from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv

load_dotenv()  # 加载 .env 文件

app = Flask(__name__)
CORS(app)  # 启用 CORS

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///charts.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 定义数据模型
class SalesData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)

class VisitorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    visitors = db.Column(db.Integer, nullable=False)
    page = db.Column(db.String(50), nullable=False)

# 初始化数据库
def init_db():
    with app.app_context():
        db.create_all()
        
        # 如果数据库为空，添加示例数据
        if not SalesData.query.first():
            categories = ['Electronics', 'Clothing', 'Food']
            for i in range(30):  # 30天的数据
                date = datetime.now() - timedelta(days=i)
                for category in categories:
                    sale = SalesData(
                        date=date,
                        amount=random.uniform(1000, 5000),
                        category=category
                    )
                    db.session.add(sale)

        if not VisitorData.query.first():
            pages = ['Home', 'Products', 'About']
            for i in range(30):  # 30天的数据
                date = datetime.now() - timedelta(days=i)
                for page in pages:
                    visitor = VisitorData(
                        date=date,
                        visitors=random.randint(100, 1000),
                        page=page
                    )
                    db.session.add(visitor)
        
        db.session.commit()

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.json
    param = data.get('param', '')
    return jsonify({'message': f'参数是{param}'})

@app.route('/api/echo2', methods=['POST'])
def echo2():
    param = request.args.get('param', '')
    data = request.json
    body = data.get('body', '')
    return jsonify({
        'message': f'body中的参数是{body}，param中的参数是{param}'
    })

@app.route('/api/sales-data')
def get_sales_data():
    sales = SalesData.query.all()
    categories = ['Electronics', 'Clothing', 'Food']
    dates = sorted(list(set(s.date.strftime('%Y-%m-%d') for s in sales)))
    
    series_data = []
    for category in categories:
        data = []
        for date in dates:
            amount = sum(s.amount for s in sales if s.category == category and s.date.strftime('%Y-%m-%d') == date)
            data.append(amount)
        series_data.append({
            'name': category,
            'type': 'line',
            'data': data
        })
    
    return jsonify({
        'dates': dates,
        'series': series_data
    })

@app.route('/api/visitor-data')
def get_visitor_data():
    visitors = VisitorData.query.all()
    pages = ['Home', 'Products', 'About']
    
    data = []
    for page in pages:
        total = sum(v.visitors for v in visitors if v.page == page)
        data.append({'value': total, 'name': page})
    
    return jsonify({
        'data': data
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    init_db()  # 初始化数据库
    app.run(host='0.0.0.0', port=port)