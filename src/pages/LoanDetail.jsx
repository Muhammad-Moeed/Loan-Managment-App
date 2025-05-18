import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Typography, Row, Col, Divider } from 'antd';
import supabase from '../services/supabaseClient';

const { Title, Text } = Typography;

const Label = ({ children }) => (
  <Text style={{ fontWeight: 600, color: '#003366' }}>{children}</Text>
);

const InfoBox = ({ label, value }) => (
  <Col xs={24} sm={12} style={{ marginBottom: 12 }}>
    <Label>{label}: </Label> <Text>{value || '-'}</Text>
  </Col>
);

const sectionStyle = {
  backgroundColor: '#f0f5ff',
  padding: '16px 24px',
  borderRadius: 10,
  marginBottom: 20,
};

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      const { data, error } = await supabase
        .from('loan-form-request')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setLoan(data);
      }
      setLoading(false);
    };

    fetchLoan();
  }, [id]);

  if (loading)
    return <Spin tip="Loading loan details..." style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }} />;

  if (error)
    return <Alert message="Error" description={error} type="error" showIcon style={{ margin: 24 }} />;

  if (!loan) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loan not found</p>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1000, margin: '40px auto 0 auto' }}>
      <Card
        title={<Title level={4} style={{ margin: 0, color: '#002766' }}>{`Loan Request Details: ${loan.full_name}`}</Title>}
        bordered={false}
        style={{
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          backgroundColor: '#e6f7ff',
        }}
      >
        <div style={sectionStyle}>
          <Divider orientation="left">👤 Personal Information</Divider>
          <Row gutter={24}>
            <InfoBox label="Full Name" value={loan.full_name} />
            <InfoBox label="Father Name" value={loan.father_name} />
            <InfoBox label="CNIC" value={loan.cnic} />
            <InfoBox label="Date of Birth" value={loan.dob} />
            <InfoBox label="Gender" value={loan.gender} />
            <InfoBox label="Marital Status" value={loan.marital_status} />
            <InfoBox label="Dependents" value={loan.dependents} />
          </Row>
        </div>

        <div style={sectionStyle}>
          <Divider orientation="left">📞 Contact Information</Divider>
          <Row gutter={24}>
            <InfoBox label="Phone" value={loan.phone} />
            <InfoBox label="Email" value={loan.email} />
            <InfoBox label="Address" value={loan.address} />
            <InfoBox label="City" value={loan.city} />
            <InfoBox label="Province" value={loan.province} />
          </Row>
        </div>

        <div style={sectionStyle}>
          <Divider orientation="left">💼 Employment Details</Divider>
          <Row gutter={24}>
            <InfoBox label="Employment Status" value={loan.employment_status} />
            <InfoBox label="Job Title" value={loan.job_title} />
            <InfoBox label="Employer" value={loan.employer} />
            <InfoBox label="Monthly Income" value={`Rs. ${loan.income}`} />
          </Row>
        </div>

        <div style={sectionStyle}>
          <Divider orientation="left">💰 Loan Information</Divider>
          <Row gutter={24}>
            <InfoBox label="Loan Amount" value={`Rs. ${loan.loan_amount}`} />
            <InfoBox label="Loan Purpose" value={loan.loan_purpose} />
            <InfoBox label="Repayment Period" value={loan.repayment_period} />
          </Row>
        </div>

        <div style={sectionStyle}>
          <Divider orientation="left">📄 Uploaded Documents</Divider>
          <Row gutter={24}>
            <InfoBox
              label="CNIC Front"
              value={<a href={loan.cnic_front_url} target="_blank" rel="noreferrer">View Document</a>}
            />
            <InfoBox
              label="CNIC Back"
              value={<a href={loan.cnic_back_url} target="_blank" rel="noreferrer">View Document</a>}
            />
            <InfoBox
              label="Bank Document"
              value={<a href={loan.bank_doc_url} target="_blank" rel="noreferrer">View Document</a>}
            />
          </Row>
        </div>

        <Text type="secondary">Submitted by User ID: {loan.user_id}</Text>
      </Card>
    </div>
  );
};

export default LoanDetail;
