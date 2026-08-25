import React from 'react';
import { Card, Form, Input, Select, Button, Row, Col, Checkbox, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchCarrierRates } from '../../store/customerRateSlice';

const CustomerRate: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rates, netFreight, fuelPercentage, total, loading } = useSelector(
    (state: RootState) => state.customerRate
  );

  const handleRateClick = () => {
    dispatch(fetchCarrierRates());
  };

  return (
    <Card
      title="Customer Rate"
      className="customer-rate-panel"
      extra={<Checkbox>Auto Rate Buy</Checkbox>}
    >
      <Form layout="vertical" className="compact-form">

        {/* Row 1: Rate selector + Carrier input + Rate button */}
        <Row gutter={[12, 12]} className="mb-16">
          {/* <Col xs={24} md={14}>
            <Form.Item noStyle>
              <Select defaultValue="Inland Transport Buy Rates" className="w-100">
                <Select.Option value="Inland Transport Buy Rates">Inland Transport Buy Rates</Select.Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col xs={24} md={6}>
            <Form.Item noStyle>
              <Input placeholder="Carrier" />
            </Form.Item>
          </Col>
          <Col xs={24} md={14}>
            <div className="flex-align-center gap-8 text-muted-13">
              <span>Mark Up</span>
              <Input defaultValue="0" className="input-sm-center"/>
              <span>%</span>
              <div>
                <Form.Item noStyle>
                  <Input placeholder="Carrier" />
                </Form.Item>
              </div>
            </div>
          </Col>
          <Col xs={24} md={4}>
            <Button type="primary" className="btn-success w-100" onClick={handleRateClick} loading={loading}>Rate</Button>
          </Col>
        </Row>

        {/* Row 2: Get Top */}
        <Row gutter={[12, 12]} className="mb-16 flex-align-center">
          <Col>
            <span className="text-muted-13">Get Top</span>
          </Col>
          <Col>
            <Form.Item noStyle>
              <Input defaultValue="10" className="input-sm-center" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Charge type + Amount + Add + Remove */}
        <Row gutter={[12, 12]} className="mb-16">
          <Col xs={24} md={12}>
            <Form.Item noStyle>
              <Select defaultValue="Charge type" className="w-100">
                <Select.Option value="Charge type">Charge type</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item noStyle>
              <Input placeholder="Amount" />
            </Form.Item>
          </Col>
          <Col xs={12} md={3}>
            <Button type="primary" className="btn-warning">Add</Button>
          </Col>
          <Col xs={12} md={3}>
            <Button danger className="w-100">Remove</Button>
          </Col>
        </Row>

      </Form>

      {/* Rate Table */}
      <div className="rate-table-wrapper">
        <div className="rate-table-content">
          <div className="rate-header-row">
            <div className="col-80">CODE</div>
            <div className="col-flex-1">DESCRIPTION</div>
            <div className="col-100 text-right">BUY AMOUNT</div>
            <div className="col-100 text-right">CUSTOMER AMOUNT</div>
          </div>
          {loading ? (
            <div className="rate-empty-state" style={{ padding: '20px' }}>
              <Spin tip="Fetching rates..." />
            </div>
          ) : rates.length > 0 ? (
            rates.map((rate) => (
              <div className="rate-header-row rate-item-row text-muted-13" key={rate.id} style={{ backgroundColor: 'transparent', color: '#333' }}>
                <div className="col-80">{rate.code}</div>
                <div className="col-flex-1">{rate.description}</div>
                <div className="col-100 text-right">${rate.buyAmount.toFixed(2)}</div>
                <div className="col-100 text-right">${rate.customerAmount.toFixed(2)}</div>
              </div>
            ))
          ) : (
            <div className="rate-empty-state">
              No rates added yet. Click Rate to fetch carrier pricing.
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="mt-16">
        <div className="flex-between mb-8 text-muted-13">
          <span>Net Freight</span>
          <strong className="text-dark-13">${netFreight.toFixed(2)}</strong>
        </div>
        <div className="flex-between mb-12 text-muted-13">
          <span>Fuel (%)</span>
          <strong className="text-dark-13">{fuelPercentage}%</strong>
        </div>
        <div className="flex-between mb-16 rate-total-row">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

      
      </div>
    </Card>
  );
};

export default CustomerRate;
