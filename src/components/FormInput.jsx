import React from 'react';
import { Form, Input, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const FormInput = ({ label, name, rules, type, options }) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {type === 'select' ? (
        <Select placeholder={`Select ${label}`}>
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      ) : type === 'date' ? (
        <DatePicker style={{ width: '100%' }} />
      ) : type === 'file' ? (
        <Upload beforeUpload={() => false} maxCount={1}>
          <UploadOutlined /> Click to upload
        </Upload>
      ) : (
        <Input placeholder={`Enter ${label}`} />
      )}
    </Form.Item>
  );
};

export default FormInput;
