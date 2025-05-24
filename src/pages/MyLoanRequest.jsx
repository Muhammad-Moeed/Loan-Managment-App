import React, { useEffect, useState, useContext, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Typography, 
  Tag, 
  Tooltip, 
  Input, 
  Space, 
  Dropdown, 
  Menu, 
  Skeleton,
  Grid
} from 'antd';
import { Link } from 'react-router-dom';
import { 
  PlusOutlined, 
  PlusCircleOutlined,
  SearchOutlined, 
  ReloadOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import supabase from '../services/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import '../index.css';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const statusConfig = {
  approved: {
    color: 'green',
    icon: <CheckCircleOutlined />,
    text: 'Approved'
  },
  pending: {
    color: 'orange',
    icon: <ClockCircleOutlined />,
    text: 'Pending'
  },
  rejected: {
    color: 'red',
    icon: <CloseCircleOutlined />,
    text: 'Rejected'
  },
  default: {
    color: 'blue',
    icon: <ClockCircleOutlined />,
    text: 'Processing'
  }
};

const MyLoanRequest = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const screens = useBreakpoint();

  const fetchLoans = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loan-form-request')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setLoans(data || []);
      setFilteredLoans(data || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredLoans(loans);
      return;
    }
    const filtered = loans.filter((loan) => {
      return (
        loan.loan_amount?.toString().includes(term) ||
        loan.status?.toLowerCase().includes(term) ||
        loan.loan_purpose?.toLowerCase().includes(term) ||
        loan.id?.toString().includes(term)
      );
    });
    setFilteredLoans(filtered);
  }, [searchTerm, loans]);

  const handleRefresh = () => {
    fetchLoans();
  };

  const getActionMenu = (record) => (
    <Menu
      items={[
        {
          key: 'view',
          icon: <FileTextOutlined />,
          label: <Link to={`/loan-detail/${record.id}`}>View Details</Link>,
        },
        {
          key: 'refresh',
          icon: <ReloadOutlined />,
          label: 'Refresh Status',
          onClick: handleRefresh,
        },
      ]}
    />
  );

  const columns = [
    {
      title: 'LOAN ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text code>#{id}</Text>,
      responsive: ['md'],
    },
    {
      title: 'AMOUNT',
      dataIndex: 'loan_amount',
      key: 'amount',
      sorter: (a, b) => (a.loan_amount || 0) - (b.loan_amount || 0),
      render: (amount) => (
        <Text strong style={{ color: '#1890ff' }}>
          {amount ? `${amount.toLocaleString()} PKR` : '-'}
        </Text>
      ),
    },
    {
      title: 'PURPOSE',
      dataIndex: 'loan_purpose',
      key: 'purpose',
      render: (purpose) => (
        <Tooltip title={purpose}>
          <Text ellipsis style={{ maxWidth: '150px' }}>
            {purpose || '-'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'DURATION',
      dataIndex: 'repayment_period',
      key: 'duration',
      sorter: (a, b) => (a.repayment_period || 0) - (b.repayment_period || 0),
      render: (duration) => `${duration ? `${duration} months` : '-'}`,
      responsive: ['lg'],
    },
    {
      title: 'APPLIED ON',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => (
        date ? new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          ...(screens.md ? { hour: '2-digit', minute: '2-digit' } : {})
        }) : '-'
      ),
      responsive: ['md'],
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
      render: (status) => {
        if (!status) status = 'pending';
        const statusLower = status.toLowerCase();
        const config = statusConfig[statusLower] || statusConfig.default;
        
        return (
          <Tag 
            color={config.color}
            icon={config.icon}
            style={{ 
              borderRadius: '20px',
              padding: '0 12px',
              fontWeight: 500,
              margin: 0,
            }}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'ACTIONS',
      key: 'action',
      render: (_, record) => (
        <Dropdown 
          overlay={getActionMenu(record)} 
          placement="bottomRight"
          trigger={['click']}
          arrow
        >
          <Button
            shape="circle"
            icon={<MoreOutlined />}
            type="text"
            style={{ color: '#8c8c8c' }}
            onClick={e => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: '20px 16px', 
      maxWidth: '100%',
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: screens.xs ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: screens.xs ? 'flex-start' : 'center',
          gap: '16px',
          width: '100%'
        }}>
          <Title level={4}
          style={{ margin: 0, fontWeight: 600, backgroundColor:'black', color : '#ffb300', padding: '8px', borderRadius: '8px' }}>
            My Loan Request
            </Title>
          <Space wrap style={{ width: screens.xs ? '100%' : 'auto' }}>
            <Link to="/new-loan" style={{ width: screens.xs ? '100%' : 'auto' }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                block={screens.xs}
                style={{
                  backgroundColor: 'black',
                  borderRadius: '8px',
                  padding: '0 20px',
                  height: '40px',
                  fontWeight: 500,
                }}
              >
                New Application
              </Button>
            </Link>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              block={screens.xs}
            >
              Refresh
            </Button>
          </Space>
        </div>

        <Input
          placeholder="Search by ID, amount, purpose or status..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          suffix={
            searchTerm && (
              <Button
                type="text"
                size="small"
                onClick={() => setSearchTerm('')}
                style={{ color: '#8c8c8c' }}
              >
                Clear
              </Button>
            )
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '8px',
          }}
        />

        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredLoans}
            rowKey="id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              showTotal: (total) => `${total} applications`,
              pageSizeOptions: ['8', '15', '30'],
            }}
            style={{ width: '100%' }}
            scroll={{ x: false }}
            locale={{
              emptyText: (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <FileTextOutlined style={{ fontSize: '48px', color: '#bfbfbf', marginBottom: '16px' }} />
                  <Text type="secondary">No loan applications found</Text>
                  <div style={{ marginTop: '16px' }}>
                    <Link to="/new-loan">
                      <Button type="primary" style={{backgroundColor:'black'}} icon={<PlusOutlined />}>
                        Apply for a new loan
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyLoanRequest;