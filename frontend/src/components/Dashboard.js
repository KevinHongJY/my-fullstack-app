import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const Dashboard = ({ user, onLogout, apiBaseUrl }) => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [salesData, setSalesData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    // 获取销售数据
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/sales-data`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('获取销售数据失败:', error);
      }
    };

    // 获取访问者数据
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/visitor-data`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVisitorData(data);
      } catch (error) {
        console.error('获取访问者数据失败:', error);
      }
    };

    fetchSalesData();
    fetchVisitorData();
  }, [apiBaseUrl]);

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

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ 
          height: '32px', 
          margin: '16px', 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          可视化平台
        </div>
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
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <Text strong style={{ fontSize: '18px' }}>
              {selectedKey === '1' ? '销售趋势分析' : '访问统计'}
            </Text>
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{user.username}</Text>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff', 
          minHeight: 500,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
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
};

export default Dashboard; 