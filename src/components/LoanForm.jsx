import React, { useState, useContext } from 'react';
import { Form, Steps, message } from 'antd';
import FormInput from './FormInput';
import FormButton from './FormButton';
import FormStepLayout from './LoanStep';
import supabase from '../services/supabaseClient';
import { uploadFile } from '../utils/uploadFile';
import { AuthContext } from '../context/AuthContext';

const { Step } = Steps;

const LoanForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { loading, setLoading } = useContext(AuthContext);

  const steps = [
    {
      title: 'Personal Info',
      fields: [
        { label: 'Full Name', name: 'fullName', rules: [{ required: true }], type: 'text' },
        { label: 'Father Name', name: 'fatherName', rules: [{ required: true }], type: 'text' },
        { label: 'CNIC', name: 'cnic', rules: [{ required: true }], type: 'text' },
        { label: 'Date of Birth', name: 'dob', rules: [{ required: true }], type: 'date' },
        {
          label: 'Gender', name: 'gender', rules: [{ required: true }], type: 'select', options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]
        },
        {
          label: 'Marital Status', name: 'maritalStatus', rules: [{ required: true }], type: 'select', options: [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
          ]
        },
        { label: 'Number of Dependents', name: 'dependents', rules: [{ required: true }], type: 'number' },
      ],
    },
    {
      title: 'Contact Info',
      fields: [
        { label: 'Phone Number', name: 'phone', rules: [{ required: true }], type: 'text' },
        { label: 'Email', name: 'email', rules: [{ required: true, type: 'email' }], type: 'text' },
        { label: 'Address', name: 'address', rules: [{ required: true }], type: 'text' },
        { label: 'City', name: 'city', rules: [{ required: true }], type: 'text' },
        { label: 'Province', name: 'province', rules: [{ required: true }], type: 'text' },
      ],
    },
    {
      title: 'Employment Info',
      fields: [
        {
          label: 'Employment Status', name: 'employmentStatus', rules: [{ required: true }], type: 'select', options: [
            { value: 'employed', label: 'Employed' },
            { value: 'unemployed', label: 'Unemployed' },
            { value: 'self-employed', label: 'Self Employed' },
          ]
        },
        { label: 'Monthly Income', name: 'income', rules: [{ required: true }], type: 'text' },
        { label: 'Job Title', name: 'jobTitle', rules: [], type: 'text' },
        { label: 'Employer Name', name: 'employer', rules: [], type: 'text' },
      ],
    },
    {
      title: 'Loan Details',
      fields: [
        { label: 'Loan Amount Required', name: 'loanAmount', rules: [{ required: true }], type: 'text' },
        { label: 'Purpose of Loan', name: 'loanPurpose', rules: [{ required: true }], type: 'text' },
        { label: 'Preferred Repayment Period (months)', name: 'repaymentPeriod', rules: [{ required: true }], type: 'number' },
      ],
    },
    {
      title: 'Upload Docs',
      fields: [
        { label: 'CNIC Front', name: 'cnicFront', rules: [{ required: true }], type: 'file' },
        { label: 'CNIC Back', name: 'cnicBack', rules: [{ required: true }], type: 'file' },
        { label: 'Payslip/Bank Statement', name: 'bankDoc', rules: [{ required: true }], type: 'file' },
      ],
    },
  ];

  const next = async () => {
    const currentFields = steps[current].fields.map((field) => field.name);
    try {
      await form.validateFields(currentFields);
      setCurrent(current + 1);
    } catch (err) {
      console.log('Validation error:', err);
      message.error("Some required fields are missing in the form.");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const formData = await form.validateFields();

      const cnicFrontFile = formData.cnicFront?.[0]?.originFileObj || formData.cnicFront?.[0];
      const cnicBackFile = formData.cnicBack?.[0]?.originFileObj || formData.cnicBack?.[0];
      const bankDocFile = formData.bankDoc?.[0]?.originFileObj || formData.bankDoc?.[0];

      const timestamp = Date.now();
      const cnicFrontPath = `cnic-front/${timestamp}_${cnicFrontFile.name}`;
      const cnicBackPath = `cnic-back/${timestamp}_${cnicBackFile.name}`;
      const bankDocPath = `bank-docs/${timestamp}_${bankDocFile.name}`;

      const cnicFrontUrl = await uploadFile(cnicFrontFile, cnicFrontPath);
      const cnicBackUrl = await uploadFile(cnicBackFile, cnicBackPath);
      const bankDocUrl = await uploadFile(bankDocFile, bankDocPath);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User fetch error:', userError);
        message.error('An error occurred while fetching user details. Please try again later.');
        return;
      }

      const { data, error } = await supabase
        .from('loan-form-request')
        .insert([
          {
            full_name: formData.fullName,
            father_name: formData.fatherName,
            cnic: formData.cnic,
            dob: formData.dob,
            gender: formData.gender,
            marital_status: formData.maritalStatus,
            dependents: formData.dependents,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            employment_status: formData.employmentStatus,
            income: formData.income,
            job_title: formData.jobTitle,
            employer: formData.employer,
            loan_amount: formData.loanAmount,
            loan_purpose: formData.loanPurpose,
            repayment_period: formData.repaymentPeriod,
            cnic_front_url: cnicFrontUrl,
            cnic_back_url: cnicBackUrl,
            bank_doc_url: bankDocUrl,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error('Insert Error:', error);
        message.error('Failed to submit your request. Please try again.');
      } else {
        message.success('Your loan request has been submitted successfully. Thank you!');
        form.resetFields();
      }

    } catch (error) {
      message.error('Unexpected error occurred. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = steps[current];

  return (
    <div style={{ padding: '30px', background: '#fff', maxWidth: '1000px', margin: 'auto', borderRadius: '12px', boxShadow: '0 5px 30px rgba(0,0,0,0.1)' }}>
      <Steps current={current} style={{ marginBottom: '40px' }}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <Form form={form} layout="vertical">
        <FormStepLayout>
          {steps.map((step, stepIndex) =>
            step.fields.map((field) => (
              <div key={field.name} style={{ display: stepIndex === current ? 'block' : 'none' }}>
                <FormInput {...field} />
              </div>
            ))
          )}
        </FormStepLayout>

        <div style={{ marginTop: 40, textAlign: 'right' }}>
          {current > 0 && <FormButton onClick={prev} type="default" style={{ marginRight: '10px' }}>Back</FormButton>}
          {current < steps.length - 1 && <FormButton onClick={next}>Next</FormButton>}
          {current === steps.length - 1 && (
            <FormButton
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </FormButton>
          )}
        </div>
      </Form>
    </div>
  );
};

export default LoanForm;
