import React from 'react';
import { Card, Form, Input, Select, Row, Col, Button } from 'antd';

const BillToLocation: React.FC = () => {
  return (
    <Card 
      title="Bill To Location" 
      extra={<Button type="link" className="add-master-btn add-line-btn">+ Add to Master</Button>}
    >
      <Form layout="vertical">
        <Form.Item label="Company Name">
          <Input placeholder='Company Name' />
        </Form.Item>
        <Form.Item label="Address Line 1">
          <Input placeholder="Address Line 1" />
        </Form.Item>
        <Form.Item label="Address Line 2">
          <Input placeholder="Address Line 2" />
        </Form.Item>
        <Form.Item label="Country">
          <Select placeholder="Country" className='w-100'>
            <Select.Option value="US">United States Of America</Select.Option>
          </Select>
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={16}>
            <Form.Item label="Postal">
              <Input placeholder="Postal Code" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="State">
              <Input placeholder='State' />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Fax No">
          <Input placeholder="Fax No" />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BillToLocation;
