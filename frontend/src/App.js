import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

// API 基础 URL
const API_BASE_URL = 'https://my-fullstack-app-production-9cdc.up.railway.app';

function App() {
  const [selectedKey, setSelectedKey] = useState('1');
  const [salesData, setSalesData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    // 获取销售数据
    fetch(`${API_BASE_URL}/api/sales-data`)
      .then(res => res.json())
      .then(data => setSalesData(data))
      .catch(err => console.error('Error fetching sales data:', err));

    // 获取访问者数据
    fetch(`${API_BASE_URL}/api/visitor-data`)
      .then(res => res.json())
      .then(data => setVisitorData(data))
      .catch(err => console.error('Error fetching visitor data:', err));
  }, []);

  const getSalesChartOption = () => {
    if (!salesData) return {};
    
    return {
      title: {
        text: '销售趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Electronics', 'Clothing', 'Food'],
        top: '50px',  // 将图例往下移
        type: 'scroll'  // 添加滚动功能
      },
      grid: {
        top: '100px',  // 给图例留出空间
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: salesData.dates,
        axisLabel: {
          rotate: 45  // 旋转标签，防止重叠
        }
      },
      yAxis: {
        type: 'value'
      },
      series: salesData.series
    };
  };

  const getVisitorChartOption = () => {
    if (!visitorData) return {};

    return {
      title: {
        text: '页面访问分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        top: '50px',
        left: 'center'
      },
      series: [{
        name: '访问量',
        type: 'pie',
        radius: '50%',
        data: visitorData.data,
        center: ['50%', '60%']  // 调整饼图位置
      }]
    };
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
          items={[
            {
              key: '1',
              icon: <LineChartOutlined />,
              label: '销售趋势'
            },
            {
              key: '2',
              icon: <PieChartOutlined />,
              label: '访问统计'
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 500 }}>
          {selectedKey === '1' ? (
            <ReactECharts 
              option={getSalesChartOption()} 
              style={{ height: '500px', width: '100%' }}
              notMerge={true}  // 防止图表重叠
              lazyUpdate={true}
            />
          ) : (
            <ReactECharts 
              option={getVisitorChartOption()} 
              style={{ height: '500px', width: '100%' }}
              notMerge={true}  // 防止图表重叠
              lazyUpdate={true}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
