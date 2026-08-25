import React from 'react';
import { Card, Form, Input, Select, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const InsuranceInfo: React.FC = () => {
  return (
    <Card
      title={
        <span>
          Shipment Information — Insurance / COD / Other{' '}
          <DownOutlined className="ns-insurance-icon" />
        </span>
      }
      className="insurance-panel"
    >
      <Form layout="vertical">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Declared Value ($)">
              <Input placeholder='Declared Value ($)'/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="COD Amount ($)">
              <Input placeholder='COD Amount ($)'/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Insurance Type">
              <Select defaultValue="None" className="w-100">
                <Select.Option value="None">None</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Special Instructions">
              <Input placeholder="Instructions" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default InsuranceInfo;
