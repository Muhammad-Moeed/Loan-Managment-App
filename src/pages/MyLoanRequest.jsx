import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MyLoanRequest = () => {
  return (
    <div style={{ padding: 24, backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <Title level={3} style={{ color: '#001529', fontWeight: '600' }}>Loan Requests</Title>

      <Empty
        description={<span style={{ color: '#888', fontSize: '16px' }}>No loan requests found</span>}
        style={{ margin: '60px 0' }}
      >
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
      </Empty>
    </div>
  );
};

export default MyLoanRequest;
