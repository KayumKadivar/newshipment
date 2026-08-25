import React from 'react';
import { Card, Form, Input, Select, Row, Col, Button } from 'antd';

const OriginLocation: React.FC = () => {
  return (
    <Card 
      title="Origin Location" 
      extra={<Button type="link" className="add-master-btn">+ Add to Master</Button>}
    >
      <Form layout="vertical">
        <Form.Item label="Company Name">
          <Input placeholder="Company name" />
        </Form.Item>
        <Form.Item label="Address Line 1">
          <Input placeholder="Street address" />
        </Form.Item>
        <Form.Item label="Address Line 2">
          <Input placeholder="Suite, dock, etc." />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={16}>
            <Form.Item label="Country">
              <Select defaultValue="US">
                <Select.Option value="US">United States Of America</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Port">
              <Input placeholder="Port" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={16}>
            <Form.Item label="Postal / ZIP">
              <Input placeholder="ZIP" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="State">
              <Input placeholder="ST" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Contact Name">
          <Input placeholder="Contact" />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={16}>
            <Form.Item label="Phone">
              <Input placeholder="(___) ___-____" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Ext">
              <Input placeholder="Ext" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item label="Email">
              <Input type="email" placeholder="email@company.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Fax">
              <Input placeholder="Fax No" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item label="Exp. Pickup Date">
              <Input placeholder="mm/dd/yyyy" />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="From">
              <Select defaultValue="08:00 AM">
                <Select.Option value="08:00 AM">8:00 AM</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="To">
              <Select defaultValue="05:00 PM">
                <Select.Option value="05:00 PM">5:00 PM</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Form.Item label="Pickup Date">
              <Input placeholder="mm/dd/yyyy"/>
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="From">
              <Select defaultValue="08:00 AM">
                <Select.Option value="08:00 AM">8:00 AM</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="To">
              <Select defaultValue="05:00 PM">
                <Select.Option value="05:00 PM">5:00 PM</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default OriginLocation;
