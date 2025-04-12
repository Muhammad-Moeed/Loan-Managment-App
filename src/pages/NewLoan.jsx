import React from 'react'
import LoanForm from '../components/LoanForm'
import { Typography } from 'antd'

const { Title } = Typography;

const MyLoan = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Apply for New Loan</Title>
      <LoanForm />
    </div>
  )
}

export default MyLoan
