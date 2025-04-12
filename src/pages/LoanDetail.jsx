import { useParams } from 'react-router-dom';
import { Card } from 'antd';

const dummyDetails = {
  '123': {
    name: 'Ali Khan',
    amount: 50000,
    status: 'Pending',
    description: 'Needs a loan for education.',
  },
  '124': {
    name: 'Zainab Fatima',
    amount: 75000,
    status: 'Approved',
    description: 'Loan approved for small business.',
  },
};

const LoanDetail = () => {
  const { id } = useParams();
  const loan = dummyDetails[id];

  if (!loan) {
    return <p>Loan not found</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card title={`Loan Details for ${loan.name}`}>
        <p><strong>Amount:</strong> {loan.amount}</p>
        <p><strong>Status:</strong> {loan.status}</p>
        <p><strong>Description:</strong> {loan.description}</p>
      </Card>
    </div>
  );
};

export default LoanDetail;
