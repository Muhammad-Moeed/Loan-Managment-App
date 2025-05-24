import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  Spin, 
  Alert, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  Tag, 
  Button, 
  Space,
  Descriptions,
  Image,
  Modal,
  message,
  ConfigProvider,
  Dropdown,
  Menu
} from 'antd';
import { 
  DownloadOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FileWordOutlined
} from '@ant-design/icons';
import supabase from '../services/supabaseClient';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;
const themeConfig = {
  token: {
    colorPrimary: '#ffc107',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#e0e0e0',
    colorText: '#212121',
    colorTextSecondary: '#424242',
    colorLink: '#ffc107',
    colorLinkHover: '#ffd54f',
  },
  components: {
    Card: {
      headerBg: '#f5f5f5',
      paddingLG: 20,
    },
    Descriptions: {
      labelBg: '#f5f5f5',
      titleMarginBottom: 12,
    },
    Button: {
      defaultHoverBg: '#f5f5f5',
      defaultHoverColor: '#ffc107',
      defaultHoverBorderColor: '#ffc107',
    },
    Badge: {
      colorError: '#f44336',
      colorSuccess: '#4caf50',
      colorWarning: '#ff9800',
    }
  }
};

const statusConfig = {
  approved: {
    color: '#4caf50',
    icon: <CheckCircleOutlined />,
    text: 'Approved'
  },
  pending: {
    color: '#ff9800',
    icon: <ClockCircleOutlined />,
    text: 'Pending Review'
  },
  rejected: {
    color: '#f44336',
    icon: <CloseCircleOutlined />,
    text: 'Rejected'
  },
  default: {
    color: '#2196f3',
    icon: <ClockCircleOutlined />,
    text: 'Processing'
  }
};

const DocumentLink = ({ url, label }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  if (!url) return <Text type="secondary">Not provided</Text>;

  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  const icon = isImage ? <FileImageOutlined style={{ color: '#ff9800' }} /> : <FilePdfOutlined style={{ color: '#f44336' }} />;

  return (
    <>
      <Space>
        {icon}
        <a 
          onClick={() => isImage ? setPreviewVisible(true) : window.open(url, '_blank')}
          style={{ cursor: 'pointer', color: '#ffc107' }}
        >
          {label || 'View Document'}
        </a>
        <Button 
          type="text" 
          icon={<DownloadOutlined style={{ color: '#ffc107' }} />} 
          size="small" 
          onClick={() => window.open(url, '_blank')}
        />
      </Space>
      {isImage && (
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          width="80%"
          bodyStyle={{ padding: 0 }}
        >
          <Image 
            src={url} 
            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            preview={false}
          />
        </Modal>
      )}
    </>
  );
};

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const { data, error } = await supabase
          .from('loan-form-request')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setLoan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

 

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = componentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`loan-application-${id}.pdf`);
      message.success('PDF exported successfully');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      message.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const getStatusTag = () => {
    const status = loan?.status?.toLowerCase() || 'pending';
    const config = statusConfig[status] || statusConfig.default;
    
    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{
          fontWeight: 500,
          fontSize: 14,
          padding: '4px 8px',
          borderRadius: 4,
          border: 'none'
        }}
      >
        {config.text}
      </Tag>
    );
  };

  const exportMenu = (
    <Menu
      items={[
        {
          key: 'pdf',
          label: 'Export as PDF',
          icon: <FilePdfOutlined style={{ color: '#f44336' }} />,
          onClick: exportToPDF
        },
        {
          key: 'excel',
          label: 'Export as Excel',
          icon: <FileExcelOutlined style={{ color: '#4caf50' }} />,
          disabled: true
        },
        {
          key: 'word',
          label: 'Export as Word',
          icon: <FileWordOutlined style={{ color: '#2196f3' }} />,
          disabled: true
        }
      ]}
    />
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}>
        <Spin tip="Loading loan details..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert 
          message="Error Loading Loan Details" 
          description={error} 
          type="error" 
          showIcon 
          closable
          action={
            <Button 
              type="primary" 
              danger 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
          style={{ borderRadius: 8 }}
        />
      </div>
    );
  }

  if (!loan) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 60,
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        borderRadius: 12,
        margin: 24
      }}>
        <Title level={4} style={{ color: '#212121' }}>Loan Application Not Found</Title>
        <Text type="secondary">The requested loan application does not exist or may have been deleted.</Text>
        <div style={{ marginTop: 24 }}>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
            style={{ background: '#ffc107', borderColor: '#ffc107' }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <div style={{ 
        padding: '24px 16px', 
        maxWidth: 1200, 
        margin: '0 auto',
        background: '#ffffff'
      }}>
        <div className="no-print" style={{ marginBottom: 24 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => window.history.back()}
            style={{ 
              marginBottom: 16,
              color: '#ffb300',
              fontSize: 16,
              fontWeight: 500
            }}
          >
            Back to Applications
          </Button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            background: '#ffffff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#ffb300', backgroundColor: 'black', padding: '6px 12px', borderRadius: 8, fontSize: 20 }}>
                Loan Application #{loan.id}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {moment(loan.created_at).format('MMMM D, YYYY [at] h:mm A')}
              </Text>
            </div>
            <Space>
              <Dropdown overlay={exportMenu} placement="bottomRight">
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  loading={exporting}
                  style={{ background: 'black' }}
                >
                  Export
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>

        <div ref={componentRef}>
          <Card
            bordered={false}
            style={{
              borderRadius: 8,
              marginBottom: 24,
              background: '#f5f5f5',
              border: '1px solid #e0e0e0'
            }}
          >
            <Descriptions 
              title={
                <span style={{ 
                  fontSize: 18, 
                  fontWeight: 600,
                  color: '#212121'
                }}>
                  Application Overview
                </span>
              } 
              bordered
              column={{ xs: 1, sm: 2, md: 3 }}
              size="middle"
              labelStyle={{ 
                fontWeight: 600,
                background: '#f5f5f5 !important',
                color: '#424242'
              }}
              contentStyle={{ 
                background: '#ffffff',
                color: '#212121'
              }}
            >
              <Descriptions.Item label="Applicant Name">
                <Text strong>{loan.full_name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Loan Amount">
                <Text strong style={{ color: '#ff9800' }}>
                  Rs. {loan.loan_amount?.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">{getStatusTag()}</Descriptions.Item>
              <Descriptions.Item label="Purpose">{loan.loan_purpose}</Descriptions.Item>
              <Descriptions.Item label="Repayment Period">
                {loan.repayment_period} months
              </Descriptions.Item>
              <Descriptions.Item label="Monthly Income">
                Rs. {loan.income?.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffc107', marginRight: 8 }}>👤</span>
                    Personal Information
                  </span>
                }
                headStyle={{ 
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 12
                }}
                style={{ 
                  borderRadius: 8,
                  height: '100%',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Descriptions 
                  column={1}
                  labelStyle={{ fontWeight: 500, color: '#424242' }}
                  contentStyle={{ color: '#212121' }}
                >
                  <Descriptions.Item label="Full Name">{loan.full_name}</Descriptions.Item>
                  <Descriptions.Item label="Father's Name">{loan.father_name || '-'}</Descriptions.Item>
                  <Descriptions.Item label="CNIC">{loan.cnic || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {loan.dob ? moment(loan.dob).format('MMMM D, YYYY') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">{loan.gender || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Marital Status">{loan.marital_status || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Dependents">{loan.dependents || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffc107', marginRight: 8 }}>📞</span>
                    Contact Information
                  </span>
                }
                headStyle={{ 
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 12
                }}
                style={{ 
                  borderRadius: 8,
                  height: '100%',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Descriptions 
                  column={1}
                  labelStyle={{ fontWeight: 500, color: '#424242' }}
                  contentStyle={{ color: '#212121' }}
                >
                  <Descriptions.Item label="Phone">{loan.phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Email">{loan.email || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Address">{loan.address || '-'}</Descriptions.Item>
                  <Descriptions.Item label="City">{loan.city || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Province">{loan.province || '-'}</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffc107', marginRight: 8 }}>💼</span>
                    Employment Details
                  </span>
                }
                headStyle={{ 
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 12
                }}
                style={{ 
                  borderRadius: 8,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Descriptions 
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 500, color: '#424242' }}
                  contentStyle={{ color: '#212121' }}
                >
                  <Descriptions.Item label="Employment Status">{loan.employment_status || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Job Title">{loan.job_title || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Employer">{loan.employer || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Monthly Income">
                    <Text strong style={{ color: '#ff9800' }}>Rs. {loan.income?.toLocaleString() || '-'}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffc107', marginRight: 8 }}>💰</span>
                    Loan Details
                  </span>
                }
                headStyle={{ 
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 12
                }}
                style={{ 
                  borderRadius: 8,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Descriptions 
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 500, color: '#424242' }}
                  contentStyle={{ color: '#212121' }}
                >
                  <Descriptions.Item label="Loan Amount">
                    <Text strong style={{ color: '#ff9800' }}>
                      Rs. {loan.loan_amount?.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Purpose">{loan.loan_purpose}</Descriptions.Item>
                  <Descriptions.Item label="Repayment Period">
                    {loan.repayment_period} months
                  </Descriptions.Item>
                  <Descriptions.Item label="Application Date">
                    {moment(loan.created_at).format('MMMM D, YYYY [at] h:mm A')}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    <span style={{ color: '#ffc107', marginRight: 8 }}>📄</span>
                    Supporting Documents
                  </span>
                }
                headStyle={{ 
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: 12
                }}
                style={{ 
                  borderRadius: 8,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Descriptions 
                  column={{ xs: 1, sm: 2 }}
                  labelStyle={{ fontWeight: 500, color: '#424242' }}
                  contentStyle={{ color: '#212121' }}
                >
                  <Descriptions.Item label="CNIC Front">
                    <DocumentLink url={loan.cnic_front_url} />
                  </Descriptions.Item>
                  <Descriptions.Item label="CNIC Back">
                    <DocumentLink url={loan.cnic_back_url} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Statement">
                    <DocumentLink url={loan.bank_doc_url} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Additional Documents">
                    {loan.additional_docs_url ? (
                      <DocumentLink url={loan.additional_docs_url} />
                    ) : (
                      <Text type="secondary">None provided</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <div className="no-print" style={{ 
            marginTop: 24, 
            textAlign: 'center',
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8,
            border: '1px solid #e0e0e0'
          }}>
            <Text type="secondary">
              Application submitted by User ID: {loan.user_id} • 
              Createed : {moment(loan.created_at).format('MMMM D, YYYY [at] h:mm A')}
            </Text>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoanDetail;