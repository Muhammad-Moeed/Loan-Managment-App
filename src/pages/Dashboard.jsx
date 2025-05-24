import {
  Card,
  Col,
  Row,
  Typography,
  List,
  Avatar,
  Statistic,
  Button,
  Spin,
  Space,
  Progress,
  Badge,
  Tag,
  Divider,
  Tooltip,
  Select,
  Popover
} from 'antd';
import {
  CheckCircleOutlined,
  HourglassOutlined,
  SolutionOutlined,
  PlusCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
  SyncOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient';
import Chart from 'react-apexcharts';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const fullName = `${data.first_name} ${data.last_name}`.trim();
        setUserName(fullName);
        setUserAvatar(data.avatar_url);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const [stats, setStats] = useState({
    active: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalAmount: 0,
    processingTime: 0,
    satisfactionRate: 0,
    rejectionRate: 0,
    defaultRate: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!user?.id) return;

      // Fetch all loan data 
      const { data: userLoans, error: loansError } = await supabase
        .from('loan-form-request')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Calculate stats 
      const today = new Date();
      const approvedLoans = userLoans.filter(loan => loan.status === 'approved');
      const pendingLoans = userLoans.filter(loan => loan.status === 'pending');
      const rejectedLoans = userLoans.filter(loan => loan.status === 'rejected');
      const defaultedLoans = userLoans.filter(loan => loan.status === 'defaulted');

      // Calculate active loans
      const activeLoans = approvedLoans.filter((loan) => {
        const approvedAt = loan.approved_at ? new Date(loan.approved_at) : null;
        const repaymentMonths = parseInt(loan.repayment_period, 10) || 0;

        if (!approvedAt) return false;

        const endDate = new Date(approvedAt);
        endDate.setMonth(endDate.getMonth() + repaymentMonths);

        return endDate > today;
      });

      // Calculate total approved amount
      const totalApprovedAmount = approvedLoans.reduce((sum, loan) => {
        return sum + (parseFloat(loan.loan_amount) || 0);
      }, 0);

      // Calculate average processing time 
      let totalProcessingTime = 0;
      let count = 0;

      approvedLoans.forEach(loan => {
        if (loan.created_at && loan.approved_at) {
          const created = new Date(loan.created_at);
          const approved = new Date(loan.approved_at);
          totalProcessingTime += (approved - created) / (1000 * 60 * 60 * 24);
          count++;
        }
      });

      const avgProcessingTime = count > 0 ? (totalProcessingTime / count) : 0;

      // Calculate satisfaction rate
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('customer-feedback')
        .select('rating')
        .eq('user_id', user.id);

      if (feedbackError) console.error('Error fetching feedback:', feedbackError);

      const totalRatings = feedbackData?.length || 0;
      const positiveRatings = feedbackData?.filter(f => f.rating >= 4).length || 0;
      const satisfactionRate = totalRatings > 0 ? Math.round((positiveRatings / totalRatings) * 100) : 0;

      // Calculate rejection rate
      const totalProcessed = approvedLoans.length + pendingLoans.length + rejectedLoans.length;
      const rejectionRate = totalProcessed > 0 ? Math.round((rejectedLoans.length / totalProcessed) * 100) : 0;

      // Calculate default rate
      const defaultRate = approvedLoans.length > 0 ? Math.round((defaultedLoans.length / approvedLoans.length) * 100) : 0;

      // Prepare chart data (last 6 months)
      const monthlyStats = {};
      const now = new Date();
      const months = [];

      // Generate last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(date.toLocaleString('default', { month: 'short' }));
        monthlyStats[date.getMonth() + '-' + date.getFullYear()] = {
          approved: 0,
          pending: 0
        };
      }

      // monthly stats with user's loans
      userLoans.forEach(loan => {
        const date = new Date(loan.created_at);
        const monthKey = date.getMonth() + '-' + date.getFullYear();

        if (monthlyStats[monthKey]) {
          if (loan.status === 'approved') {
            monthlyStats[monthKey].approved++;
          } else if (loan.status === 'pending') {
            monthlyStats[monthKey].pending++;
          }
        }
      });

      // Prepare chart data
      const chartSeries = [
        {
          name: 'Approved Loans',
          data: Object.values(monthlyStats).map(m => m.approved)
        },
        {
          name: 'Pending Loans',
          data: Object.values(monthlyStats).map(m => m.pending)
        }
      ];

      // Prepare performance metrics
      const metrics = [
        {
          key: 'approvalRate',
          title: 'Approval Rate',
          value: approvedLoans.length > 0 ? Math.round((approvedLoans.length / (approvedLoans.length + pendingLoans.length + rejectedLoans.length)) * 100) : 0,
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
          description: 'Percentage of your approved applications'
        },
        {
          key: 'processingTime',
          title: 'Processing Time',
          value: avgProcessingTime.toFixed(1),
          unit: 'days',
          icon: <ClockCircleOutlined />,
          color: getProcessingTimeColor(avgProcessingTime),
          description: 'Average time for your loan approvals'
        },
        {
          key: 'satisfaction',
          title: 'Satisfaction',
          value: satisfactionRate,
          unit: '%',
          icon: <UserOutlined />,
          color: '#722ed1',
          description: 'Your satisfaction score'
        },
        {
          key: 'rejectionRate',
          title: 'Rejection Rate',
          value: rejectionRate,
          unit: '%',
          icon: <PercentageOutlined />,
          color: '#f5222d',
          description: 'Percentage of your rejected applications'
        },
        {
          key: 'defaultRate',
          title: 'Default Rate',
          value: defaultRate,
          unit: '%',
          icon: <PercentageOutlined />,
          color: '#fa8c16',
          description: 'Percentage of your defaulted loans'
        }
      ];

      setStats({
        active: activeLoans.length,
        approved: approvedLoans.length,
        pending: pendingLoans.length,
        rejected: rejectedLoans.length,
        totalAmount: totalApprovedAmount,
        processingTime: avgProcessingTime,
        satisfactionRate,
        rejectionRate,
        defaultRate
      });

      setRecentActivities(
        userLoans.map((loan) => ({
          id: loan.id,
          user: loan.full_name || userName || 'You',
          action: `Loan ${loan.status}`,
          time: dayjs(loan.created_at).fromNow(),
          amount: loan.loan_amount,
          status: loan.status,
          approvedAt: loan.approved_at,
          avatarUrl: userAvatar
        }))
      );

      setChartData({
        options: {
          chart: {
            height: 280,
            type: 'area',
            toolbar: { show: false },
            zoom: { enabled: false }
          },
          colors: ['#52c41a', '#faad14'],
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth', width: 2 },
          fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
          xaxis: { categories: months },
          tooltip: { fixed: { enabled: false, position: 'topRight' } },
          legend: { position: 'top', horizontalAlign: 'right' }
        },
        series: chartSeries
      });

      setPerformanceMetrics(metrics);

    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, user?.id, userName, userAvatar]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#52c41a';
      case 'pending': return '#faad14';
      case 'rejected': return '#f5222d';
      case 'defaulted': return '#fa8c16';
      default: return '#d9d9d9';
    }
  };

  const getProcessingTimeColor = (days) => {
    if (days < 1) return '#52c41a';
    if (days < 3) return '#1890ff';
    return '#faad14';
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh', marginTop: 30 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header with filters */}
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title
              level={3}
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: '26px',
                color: '#ffb300',
                backgroundColor:'black',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              <SmileOutlined style={{ color: 'white'}} />
              Welcome, {userName || 'User'}
            </Title>

            <Text type="secondary">Your loan application overview</Text>
          </Col>

          <Col>
            <Space size="middle">
              <Select
                value={timeRange}
                style={{ width: 120 }}
                onChange={setTimeRange}
                suffixIcon={<CalendarOutlined />}
              >
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="quarter">This Quarter</Option>
                <Option value="year">This Year</Option>
              </Select>

              <Link to="/new-loan">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  style={{
                    backgroundColor: 'black',
                    borderRadius: '8px',
                    padding: '0 20px',
                    height: 40,
                    fontWeight: 500,
                  }}
                >
                  New Application
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>

        {/* Stats Overview */}
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="Your Total Approved Amount"
                value={stats.totalAmount.toLocaleString()}
                prefix={<MoneyCollectOutlined />}
                valueStyle={{ color: '#1a1a1a', fontSize: 28 }}
                suffix="PKR"
              />
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Tag color="blue">{timeRange}</Tag>
                <Text type="secondary">Updated {dayjs().format('h:mm A')}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="Your Active Loans"
                value={stats.active}
                prefix={<SolutionOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: 28 }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Progress
                percent={stats.approved > 0 ? Math.round((stats.active / stats.approved) * 100) : 0}
                showInfo={false}
                strokeColor="#1890ff"
              />
              <Text type="secondary">{stats.active} out of {stats.approved} active</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title="Approved Loans"
                value={stats.approved}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: 28 }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Text type="success">
                  <ArrowUpOutlined /> {stats.approved > 0 ? Math.round((stats.approved / (stats.approved + stats.pending + stats.rejected)) * 100) : 0}%
                </Text>
                <Text type="secondary">your approval rate</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              bordered={false} 
              style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
              extra={
                <Button 
                  icon={<SyncOutlined />} 
                  onClick={() => fetchDashboardData()}
                  size="small"
                />
              }
            >
              <Statistic
                title="Pending Requests"
                value={stats.pending}
                prefix={<HourglassOutlined />}
                valueStyle={{ color: '#faad14', fontSize: 28 }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <SyncOutlined spin style={{ color: '#faad14' }} />
                <Text type="secondary">Your applications in review</Text>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Charts and Performance Metrics Row */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Your Loan Trends (Last 6 Months)</Text>
                </Space>
              }
              extra={
                <Select defaultValue="approved" style={{ width: 120 }}>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="all">All</Option>
                </Select>
              }
              loading={loading}
            >
              {chartData ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={280}
                />
              ) : (
                <div style={{ height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Spin size="large" />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, height: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Your Performance Metrics</Text>
                </Space>
              }
              loading={loading}
              extra={
                <Popover content="Your personal loan performance indicators">
                  <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                </Popover>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {performanceMetrics.map(metric => (
                  <div key={metric.key} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text strong>
                        {metric.icon} {metric.title}
                      </Text>
                      <Text strong style={{ color: metric.color }}>
                        {metric.value} {metric.unit || ''}
                      </Text>
                    </div>
                    {metric.key === 'processingTime' ? (
                      <Progress
                        percent={100 - Math.min(100, metric.value * 20)}
                        showInfo={false}
                        strokeColor={metric.color}
                      />
                    ) : (
                      <Progress
                        percent={metric.value}
                        showInfo={false}
                        strokeColor={metric.color}
                      />
                    )}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {metric.description}
                    </Text>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row>
          <Col xs={24}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.1)' }}
              title={
                <Space>
                  <FileTextOutlined style={{ color: '#ffb300' }} />
                  <Text strong>Your Recent Loan Activities</Text>
                </Space>
              }
              extra={
                <Link to="/my-loan-request">
                  <Button type="link">View All</Button>
                </Link>
              }
              loading={loading}
            >
              {recentActivities.length === 0 && !loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  backgroundSize: '100px',
                  paddingTop: '120px'
                }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                    No loan applications found
                  </Text>
                  <Link to="/new-loan">
                    <Button type="primary" icon={<PlusCircleOutlined />}
                    style={{ backgroundColor: 'black', borderRadius: '8px', padding: '0 20px', height: 40, fontWeight: 500 }}
                    >
                      Create Your First Loan
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
                        avatar={
                          <Avatar 
                            src={userAvatar} 
                            icon={!userAvatar && <UserOutlined />}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>You</Text>
                            <Badge
                              color={getStatusColor(item.status)}
                              text={item.status}
                              style={{ textTransform: 'capitalize' }}
                            />
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={2}>
                            <div>
                              <Text>{item.action}</Text>
                              {item.amount && (
                                <Text strong style={{ marginLeft: 8 }}>
                                  {parseFloat(item.amount).toLocaleString()} PKR
                                </Text>
                              )}
                            </div>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.time}
                                {item.approvedAt && (
                                  <span> • Approved {dayjs(item.approvedAt).fromNow()}</span>
                                )}
                              </Text>
                            </div>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Dashboard;