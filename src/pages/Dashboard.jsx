import {
  Card,
  Col,
  Row,
  Typography,
  List,
  Avatar,
  Statistic,
  Button
} from 'antd';
import {
  CheckCircleOutlined,
  HourglassOutlined,
  SolutionOutlined,
  UserOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const { Title } = Typography;

const recentActivities = [];

const Dashboard = () => {
  return (
    <div style={{ padding: 24, backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <Title level={3} style={{ color: '#001529', fontWeight: '600' }}>Dashboard Overview</Title>

      <Row gutter={[16, 16]}>
        {/* Active Loans Card */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              background: '#1890ff',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Statistic
              title="Active Loans"
              value={0}
              prefix={<SolutionOutlined style={{ color: '#fff' }} />}
              valueStyle={{ fontSize: '24px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        {/* Approved Loans Card */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              background: '#52c41a',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Statistic
              title="Approved Loans"
              value={0}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ fontSize: '24px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        {/* Pending Requests Card */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              background: '#faad14',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Statistic
              title="Pending Requests"
              value={0}
              prefix={<HourglassOutlined style={{ color: '#fff' }} />}
              valueStyle={{ fontSize: '24px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        {/* References Card */}
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            style={{
              background: '#eb2f96',
              color: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Statistic
              title="References"
              value={0}
              prefix={<UserOutlined style={{ color: '#fff' }} />}
              valueStyle={{ fontSize: '24px', fontWeight: '600' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={4} style={{ color: '#001529', fontWeight: '600' }}>Recent Activity</Title>

        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
          {recentActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '16px', color: '#888' }}>No recent activity found.</p>
              <Link to="/new-loan">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  style={{
                    backgroundColor: '#000',
                    borderColor: '#000',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#fff',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Apply for New Loan
                </Button>

              </Link>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{item.user[0]}</Avatar>}
                    title={<span>{item.user}</span>}
                    description={
                      <>
                        {item.action}
                        <div style={{ fontSize: '12px', color: '#888' }}>{item.time}</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
