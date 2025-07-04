# 可视化平台 - 登录注册系统

这是一个基于 Flask + React 的全栈可视化平台，包含用户认证系统和数据可视化功能。

## 功能特性

### 🔐 用户认证
- 用户注册（用户名、邮箱、密码）
- 用户登录
- 会话管理
- 密码加密存储
- 路由保护

### 📊 数据可视化
- 销售趋势图表（折线图）
- 访问统计图表（饼图）
- 响应式设计
- 实时数据更新

### 🎨 用户界面
- 现代化UI设计
- 响应式布局
- 中文界面
- 用户友好的交互体验

## 技术栈

### 后端
- **Flask** - Python Web框架
- **Flask-SQLAlchemy** - 数据库ORM
- **Flask-Login** - 用户会话管理
- **Flask-Bcrypt** - 密码加密
- **Flask-CORS** - 跨域支持
- **SQLite** - 数据库

### 前端
- **React** - JavaScript框架
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **ECharts** - 数据可视化
- **Axios** - HTTP客户端

## 项目结构

```
my-fullstack-app/
├── backend/
│   ├── app.py              # Flask应用主文件
│   ├── requirements.txt    # Python依赖
│   ├── venv/              # Python虚拟环境
│   └── instance/
│       └── charts.db      # SQLite数据库
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js      # 登录组件
│   │   │   ├── Register.js   # 注册组件
│   │   │   └── Dashboard.js  # 仪表板组件
│   │   ├── App.js          # 主应用组件
│   │   └── App.css         # 样式文件
│   ├── package.json        # Node.js依赖
│   └── public/             # 静态文件
└── README.md
```

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd my-fullstack-app
```

### 2. 后端设置
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. 前端设置
```bash
cd frontend
npm install
npm start
```

### 4. 访问应用
- 前端: my-fullstack-app-chi.vercel.app

## API接口

### 认证接口
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `POST /api/logout` - 用户登出
- `GET /api/user` - 获取当前用户信息

### 数据接口
- `GET /api/sales-data` - 获取销售数据
- `GET /api/visitor-data` - 获取访问数据

## 部署

### Railway部署
项目已配置Railway部署，包含：
- `railway.toml` - Railway配置文件
- `Procfile` - 进程管理文件
- 环境变量配置

### Vercel部署
前端已配置Vercel部署，包含：
- `vercel.json` - Vercel配置文件
- 自动构建和部署

## 开发说明

### 数据库
- 使用SQLite作为开发数据库
- 自动创建示例数据
- 支持用户表和业务数据表

### 安全特性
- 密码bcrypt加密
- 会话管理
- CORS配置
- 输入验证

### 响应式设计
- 支持桌面和移动设备
- 自适应布局
- 触摸友好的交互

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！ 
