import React from 'react'
import LoanForm from '../components/LoanForm'
import { Typography } from 'antd'

const { Title } = Typography;

const MyLoan = () => {
  return (
    <div style={{ paddingLeft: 20, }}>
      <Title level={3} style={{ fontWeight: 600, backgroundColor:'black', color : '#ffb300', padding: '8px', borderRadius: '8px', display : 'inline-block' }}>
       New Loan Application</Title>
      <LoanForm />
    </div>
  )
}

export default MyLoan
