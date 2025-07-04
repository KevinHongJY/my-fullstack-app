from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv

load_dotenv()  

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
    "https://my-fullstack-app-kevinshongjy-kevins-projects-33450a43.vercel.app",
    "https://my-fullstack-app-kevins-projects-33450a43.vercel.app",
    "https://my-fullstack-bteso9fi5-kevins-projects-33450a43.vercel.app",
    "https://my-fullstack-app-chi.vercel.app",
    "http://localhost:3000"
])
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# 会话配置
app.config['SESSION_COOKIE_SECURE'] = True  
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  

# 初始化扩展
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# 未登录时返回 JSON
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({'error': '未登录'}), 401

# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///charts.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 用户模型
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

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

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

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

# 认证相关路由
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': '无效的JSON数据'}), 400
            
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': '所有字段都是必填的'}), 400
        
        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({'error': '用户名已存在'}), 400
        
        # 检查邮箱是否已存在
        if User.query.filter_by(email=email).first():
            return jsonify({'error': '邮箱已被注册'}), 400
        
        # 创建新用户
        user = User(username=username, email=email)
        user.set_password(password)
        
        try:
            db.session.add(user)
            db.session.commit()
            return jsonify({'message': '注册成功'}), 201
        except Exception as e:
            db.session.rollback()
            print(f"数据库错误: {e}")
            return jsonify({'error': '注册失败'}), 500
    except Exception as e:
        print(f"注册错误: {e}")
        return jsonify({'error': '服务器错误'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': '无效的JSON数据'}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '用户名和密码都是必填的'}), 400
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            return jsonify({
                'message': '登录成功',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }), 200
        else:
            return jsonify({'error': '用户名或密码错误'}), 401
    except Exception as e:
        print(f"登录错误: {e}")
        return jsonify({'error': '服务器错误'}), 500

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': '登出成功'}), 200

@app.route('/api/user', methods=['GET'])
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email
            }
        }), 200
    else:
        return jsonify({'error': '未登录'}), 401

@app.route('/')
def index():
    return jsonify({'message': '可视化平台 API 服务正在运行'})

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

@app.route('/api/sales-data', methods=['GET'])
@login_required
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

@app.route('/api/visitor-data', methods=['GET'])
@login_required
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

# 应用启动时初始化数据库
with app.app_context():
    init_db()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port)