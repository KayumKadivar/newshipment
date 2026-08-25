import React from 'react';
import { Card, Form, Input, Select, Row, Col } from 'antd';

const ShipmentInformation: React.FC = () => {
  return (
    <Card 
      title="Shipment Information" 
      className="shipment-panel"
    >
      <Form layout="vertical">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Mode">
              <Select defaultValue="LTL">
                <Select.Option value="LTL">LTL</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Equipment">
              <Select defaultValue="LTL">
                <Select.Option value="LTL">LTL</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Service Level">
              <Select defaultValue="Standard">
                <Select.Option value="Standard">Standard</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Priority">
              <Select defaultValue="Standard">
                <Select.Option value="Standard">Standard</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Payment Term">
          <Select defaultValue="3rd Party Prep">
            <Select.Option value="3rd Party Prep">3rd Party Prep</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Customer Reference #">
          <Input placeholder="Customer ref #" />
        </Form.Item>

        <Form.Item label="Shipment Number">
          <Input placeholder="Auto-generated" />
        </Form.Item>

        <Form.Item label="Inland LD #">
          <Input placeholder="Inland LD #" />
        </Form.Item>

        <Form.Item label="PO #">
          <Input placeholder="Purchase order #" />
        </Form.Item>

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Carrier Quote #">
              <Input placeholder="Quote #" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Carrier BOL #">
              <Input placeholder="BOL #" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Form.Item label="PRO #" style={{ marginBottom: 0 }}>
              <Input placeholder="PRO #" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Pickup #" style={{ marginBottom: 0 }}>
              <Input placeholder="Pickup #" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ShipmentInformation;
