import React from 'react';
import { Card, Input, Checkbox, Row, Col, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
const Accessorials: React.FC = () => {
  const accessorialsList = useSelector((state: RootState) => state.accessorials.data);

  return (
    <Card 
      title="Accessorials" 
      className="accessorials-panel"
    >
      <Form.Item>
        <Input 
          placeholder="Search accessorials..." 
          prefix={<SearchOutlined />}
        />
      </Form.Item>
      <Row gutter={[12, 12]}>
        {accessorialsList.map((item) => {
          return (
            <Col span={12} key={item}>
              <div>
                <Checkbox>{item}
                </Checkbox>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default Accessorials;
