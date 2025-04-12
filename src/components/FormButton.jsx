import React from 'react';
import { Button } from 'antd';

const FormButton = ({ children, onClick, type = 'primary', style = {} }) => {
  return (
    <Button type={type} onClick={onClick} style={{ padding: '0 30px', height: '40px', ...style }}>
      {children}
    </Button>
  );
};

export default FormButton;
