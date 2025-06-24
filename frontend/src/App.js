import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

// API 基础 URL - 生产环境直接用 Railway 地址
const API_BASE_URL = 'https://my-fullstack-app-production-9cdc.up.railway.app';

function App() {
  const [selectedKey, setSelectedKey] = useState('1');
  const [salesData, setSalesData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    // 获取销售数据
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sales-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        // 可以根据需要在此处处理错误
      }
    };

    // 获取访问者数据
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/visitor-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVisitorData(data);
      } catch (error) {
        // 可以根据需要在此处处理错误
      }
    };

    fetchSalesData();
    fetchVisitorData();
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
        top: '50px',
        type: 'scroll'
      },
      grid: {
        top: '100px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: salesData.dates,
        axisLabel: {
          rotate: 45
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
        center: ['50%', '60%']
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
              notMerge={true}
              lazyUpdate={true}
            />
          ) : (
            <ReactECharts 
              option={getVisitorChartOption()} 
              style={{ height: '500px', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
