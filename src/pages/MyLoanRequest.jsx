import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Table, Button, Typography, Tag, Tooltip, Input, Space, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { PlusCircleOutlined, SearchOutlined, CloseCircleOutlined, MoreOutlined } from '@ant-design/icons';
import supabase from '../services/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import '../index.css';

const { Title } = Typography;

const MyLoanRequest = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLoans = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('loan-form-request')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching loans:', error);
    } else {
      setLoans(data || []);
      setFilteredLoans(data || []);
    }
    setLoading(false);
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
    const filtered = loans.filter(({ loan_amount, status }) => {
      const amountStr = loan_amount?.toString().toLowerCase() || '';
      const statusStr = status?.toLowerCase() || '';
      return amountStr.includes(term) || statusStr.includes(term);
    });
    setFilteredLoans(filtered);
  }, [searchTerm, loans]);

  const getActionMenu = (record) => (
    <Menu
      items={[
        {
          key: 'view',
          label: <Link to={`/loan-detail/${record.id}`}>View Details</Link>,
        },
      ]}
    />
  );

  const columns = [
    {
      title: <b>Loan Amount</b>,
      dataIndex: 'loan_amount',
      key: 'amount',
      sorter: (a, b) => (a.loan_amount || 0) - (b.loan_amount || 0),
      render: (amount) => (amount ? `${amount.toLocaleString()} Pkr` : '-'),
      width: 140,
    },
    {
      title: <b>Duration</b>,
      dataIndex: 'repayment_period',
      key: 'duration',
      sorter: (a, b) => (a.repayment_period || 0) - (b.repayment_period || 0),
      render: (duration) => (duration ? `${duration} months` : '-'),
      width: 130,
    },
    {
      title: <b>Applied On</b>,
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
      width: 140,
    },
    {
      title: <b>Status</b>,
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
      render: (status) => {
        if (!status) status = 'Unknown';
        let color = 'blue';
        switch (status.toLowerCase()) {
          case 'approved':
            color = 'green';
            break;
          case 'rejected':
            color = 'red';
            break;
          case 'pending':
            color = 'orange';
            break;
          default:
            color = 'blue';
        }
        return (
          <Tooltip title={`Status: ${status}`}>
            <Tag color={color} style={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {status}
            </Tag>
          </Tooltip>
        );
      },
      width: 120,
    },
    {
      title: <b>Actions</b>,
      key: 'action',
      fixed: 'right',
      className: 'action-column',
      width: 60,
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button
            icon={<MoreOutlined />}
            type="text"
            style={{ fontSize: 20, color: '#1890ff' }}
            onClick={e => e.preventDefault()}
            aria-label="actions"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ paddingTop: 20 }}>
      <div className="content-box" style={{ marginTop: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0, color: '#004085', backgroundColor: '#cce5ff', padding: '10px 15px', borderRadius: 8 }}>
            My Loan Requests
          </Title>

          <Link to="/new-loan">
            <Button
              icon={<PlusCircleOutlined />}
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 600,
                backgroundColor: '#222', // dark background for button
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#000'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#222'}
            >
              Apply for Loan
            </Button>
          </Link>
        </Space>

        <Space style={{ width: '100%', marginBottom: 16, justifyContent: 'flex-end' }} align="center" size="small">
          <Input
            placeholder="Search by amount or status"
            prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
            style={{
              width: 300,
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
              fontWeight: 500,
              fontSize: 14,
            }}
          />
          {searchTerm && (
            <Button
              icon={<CloseCircleOutlined />}
              type="text"
              danger
              onClick={() => setSearchTerm('')}
              style={{ fontWeight: 600 }}
            >
              Clear
            </Button>
          )}
        </Space>

        <Table
          className="stylish-table"
          loading={loading}
          dataSource={filteredLoans}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6, showSizeChanger: true, pageSizeOptions: ['5', '6', '10', '20'] }}
          scroll={{ x: 700 }}
          bordered={false}
          size="middle"
          locale={{ emptyText: 'No loan requests found. Apply for a new loan.' }}
          rowClassName={() => 'custom-row-style'}
          style={{
            borderRadius: 12,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          
          }}
        />
      </div>
    </div>
  );
};

export default MyLoanRequest;
