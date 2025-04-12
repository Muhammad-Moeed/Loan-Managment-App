import React, { useState } from 'react';
import { Form, Steps, message } from 'antd';
import FormInput from './FormInput';
import FormButton from './FormButton';
import FormStepLayout from './LoanStep';

const { Step } = Steps;

const LoanForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Personal Info',
      fields: [
        { label: 'Full Name', name: 'fullName', rules: [{ required: true }], type: 'text' },
        { label: 'Father Name', name: 'fatherName', rules: [{ required: true }], type: 'text' },
        { label: 'CNIC', name: 'cnic', rules: [{ required: true }], type: 'text' },
        { label: 'Date of Birth', name: 'dob', rules: [{ required: true }], type: 'date' },
        { label: 'Gender', name: 'gender', rules: [{ required: true }], type: 'select', options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ] },
        { label: 'Marital Status', name: 'maritalStatus', rules: [{ required: true }], type: 'select', options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
        ] },
      ],
    },
    {
      title: 'Contact Info',
      fields: [
        { label: 'Phone Number', name: 'phone', rules: [{ required: true }], type: 'text' },
        { label: 'Email', name: 'email', rules: [{ required: true, type: 'email' }], type: 'text' },
        { label: 'Address', name: 'address', rules: [{ required: true }], type: 'text' },
      ],
    },
    {
      title: 'Employment Info',
      fields: [
        { label: 'Employment Status', name: 'employmentStatus', rules: [{ required: true }], type: 'select', options: [
          { value: 'employed', label: 'Employed' },
          { value: 'unemployed', label: 'Unemployed' },
        ] },
        { label: 'Monthly Income', name: 'income', rules: [{ required: true }], type: 'text' },
        { label: 'Job Title', name: 'jobTitle', rules: [], type: 'text' },
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

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
      message.success('Form submitted successfully!');
    });
  };

  const currentStep = steps[current];

  return (
    <div style={{ padding: '30px', background: '#fff', maxWidth: '1000px', margin: 'auto', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
      <Steps current={current} style={{ marginBottom: '40px' }}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <Form form={form} layout="vertical">
        <FormStepLayout>
          {currentStep.fields.map((field) => (
            <FormInput key={field.name} {...field} />
          ))}
        </FormStepLayout>

        <div style={{ marginTop: 40, textAlign: 'right' }}>
          {current > 0 && <FormButton onClick={prev} type="default" style={{ marginRight: '10px' }}>Back</FormButton>}
          {current < steps.length - 1 && <FormButton onClick={next}>Next</FormButton>}
          {current === steps.length - 1 && <FormButton onClick={handleSubmit}>Submit</FormButton>}
        </div>
      </Form>
    </div>
  );
};

export default LoanForm;
