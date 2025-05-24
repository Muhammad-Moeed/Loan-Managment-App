import React, { useState, useContext } from 'react';
import { Form, Steps, message, Row, Col } from 'antd';
import FormInput from './FormInput';
import FormButton from './FormButton';
import supabase from '../services/supabaseClient';
import { uploadFile } from '../utils/uploadFile';
import { AuthContext } from '../context/AuthContext';

const { Step } = Steps;

const LoanForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { loading, setLoading } = useContext(AuthContext);
  const [formValues, setFormValues] = useState({});
  const [formKey, setFormKey] = useState(0);

  const steps = [
    {
      title: 'Personal Info',
      content: (
        <Row gutter={16}>
          <Col span={12}>
            <FormInput label="Full Name" name="fullName" rules={[{ required: true }]} type="text" />
            <FormInput label="Father Name" name="fatherName" rules={[{ required: true }]} type="text" />
            <FormInput label="CNIC" name="cnic" rules={[{ required: true }]} type="text" />
            <FormInput label="Date of Birth" name="dob" rules={[{ required: true }]} type="date" />
          </Col>
          <Col span={12}>
            <FormInput 
              label="Gender" 
              name="gender" 
              rules={[{ required: true }]} 
              type="select" 
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]} 
            />
            <FormInput 
              label="Marital Status" 
              name="maritalStatus" 
              rules={[{ required: true }]} 
              type="select" 
              options={[
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'divorced', label: 'Divorced' },
              ]} 
            />
            <FormInput label="Number of Dependents" name="dependents" rules={[{ required: true }]} type="number" />
          </Col>
        </Row>
      )
    },
    {
      title: 'Contact Info',
      content: (
        <Row gutter={16}>
          <Col span={12}>
            <FormInput label="Phone Number" name="phone" rules={[{ required: true }]} type="text" />
            <FormInput label="Email" name="email" rules={[{ required: true, type: 'email' }]} type="text" />
          </Col>
          <Col span={12}>
            <FormInput label="Address" name="address" rules={[{ required: true }]} type="text" />
            <FormInput label="City" name="city" rules={[{ required: true }]} type="text" />
            <FormInput label="Province" name="province" rules={[{ required: true }]} type="text" />
          </Col>
        </Row>
      )
    },
    {
      title: 'Employment Info',
      content: (
        <Row gutter={16}>
          <Col span={12}>
            <FormInput 
              label="Employment Status" 
              name="employmentStatus" 
              rules={[{ required: true }]} 
              type="select" 
              options={[
                { value: 'employed', label: 'Employed' },
                { value: 'unemployed', label: 'Unemployed' },
                { value: 'self-employed', label: 'Self Employed' },
              ]} 
            />
            <FormInput label="Monthly Income" name="income" rules={[{ required: true }]} type="text" />
          </Col>
          <Col span={12}>
            <FormInput label="Job Title" name="jobTitle" rules={[]} type="text" />
            <FormInput label="Employer Name" name="employer" rules={[]} type="text" />
          </Col>
        </Row>
      )
    },
    {
      title: 'Loan Details',
      content: (
        <Row gutter={16}>
          <Col span={12}>
            <FormInput label="Loan Amount Required" name="loanAmount" rules={[{ required: true }]} type="text" />
            <FormInput label="Purpose of Loan" name="loanPurpose" rules={[{ required: true }]} type="text" />
          </Col>
          <Col span={12}>
            <FormInput 
              label="Preferred Repayment Period (months)" 
              name="repaymentPeriod" 
              rules={[{ required: true }]} 
              type="number" 
            />
          </Col>
        </Row>
      )
    },
    {
      title: 'Upload Docs',
      content: (
        <Row gutter={16}>
          <Col span={8}>
            <FormInput label="CNIC Front" name="cnicFront" rules={[{ required: true }]} type="file" />
          </Col>
          <Col span={8}>
            <FormInput label="CNIC Back" name="cnicBack" rules={[{ required: true }]} type="file" />
          </Col>
          <Col span={8}>
            <FormInput label="Payslip/Bank Statement" name="bankDoc" rules={[{ required: true }]} type="file" />
          </Col>
        </Row>
      )
    },
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormValues(prev => ({ ...prev, ...values }));
      setCurrent(current + 1);
    } catch (err) {
      console.log('Validation error:', err);
      message.error("Please fill all required fields before proceeding.");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const finalValues = { ...formValues, ...form.getFieldsValue() };
      console.log('Final form values:', finalValues); // Debug log

      // Upload files
      const cnicFrontFile = finalValues.cnicFront?.[0]?.originFileObj;
      const cnicBackFile = finalValues.cnicBack?.[0]?.originFileObj;
      const bankDocFile = finalValues.bankDoc?.[0]?.originFileObj;

      if (!cnicFrontFile || !cnicBackFile || !bankDocFile) {
        throw new Error('Please upload all required documents');
      }

      const timestamp = Date.now();
      const cnicFrontPath = `cnic-front/${timestamp}_${cnicFrontFile.name}`;
      const cnicBackPath = `cnic-back/${timestamp}_${cnicBackFile.name}`;
      const bankDocPath = `bank-docs/${timestamp}_${bankDocFile.name}`;

      const [cnicFrontUrl, cnicBackUrl, bankDocUrl] = await Promise.all([
        uploadFile(cnicFrontFile, cnicFrontPath),
        uploadFile(cnicBackFile, cnicBackPath),
        uploadFile(bankDocFile, bankDocPath)
      ]);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const submissionData = {
        full_name: finalValues.fullName,
        father_name: finalValues.fatherName,
        cnic: finalValues.cnic,
        dob: finalValues.dob?.format('YYYY-MM-DD'), // Format date properly
        gender: finalValues.gender,
        marital_status: finalValues.maritalStatus,
        dependents: finalValues.dependents,
        phone: finalValues.phone,
        email: finalValues.email,
        address: finalValues.address,
        city: finalValues.city,
        province: finalValues.province,
        employment_status: finalValues.employmentStatus,
        income: finalValues.income,
        job_title: finalValues.jobTitle,
        employer: finalValues.employer,
        loan_amount: finalValues.loanAmount,
        loan_purpose: finalValues.loanPurpose,
        repayment_period: finalValues.repaymentPeriod,
        cnic_front_url: cnicFrontUrl,
        cnic_back_url: cnicBackUrl,
        bank_doc_url: bankDocUrl,
        user_id: user.id,
      };

      console.log('Submitting data:', submissionData);

      // Submit form data
      const { error } = await supabase
        .from('loan-form-request')
        .insert([submissionData]);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      message.success('Your loan request has been submitted successfully!');
      form.resetFields();
      setFormValues({});
      setCurrent(0);
      setFormKey(prev => prev + 1);

    } catch (error) {
      console.error('Submission error:', error);
      message.error(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-form-container">
      <Steps current={current} className="form-steps">
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <div className="steps-content">
        <Form 
          key={formKey}
          form={form} 
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormValues(prev => ({ ...prev, ...changedValues }));
          }}
        >
          {steps[current].content}
        </Form>
      </div>

      <div className="steps-action">
        {current > 0 && (
          <FormButton onClick={prev} type="default" style={{ marginRight: 8 }}>
            Back
          </FormButton>
        )}
        {current < steps.length - 1 && (
          <FormButton type="primary" onClick={next}>
            Next
          </FormButton>
        )}
        {current === steps.length - 1 && (
          <FormButton 
            type="primary" 
            onClick={handleSubmit}
            loading={loading}
          >
            Submit
          </FormButton>
        )}
      </div>

      <style jsx>{`
        .loan-form-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .form-steps {
          margin-bottom: 32px;
        }
        .steps-content {
          min-height: 300px;
          padding: 20px;
          background: #fafafa;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .steps-action {
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default LoanForm;