import React from 'react';
import { Card, Form, Input, Button, Checkbox, Radio, Space } from 'antd';

const InternalNotes: React.FC = () => {
  return (
    <Card title="Internal Notes" className="internal-notes-panel">
      <Form layout="vertical">
        <Form.Item label="Customer / Internal Note">
          <Input.TextArea placeholder="Note..." rows={4} className="resize-none" />
        </Form.Item>
        <div className="internal-notes-panle-footer">
          <div>
          <Space size="large">
            <Checkbox defaultChecked>Private</Checkbox>
            <Radio.Group defaultValue="Notes">
              <Radio value="Notes">Notes</Radio>
              <Radio value="Log">Log</Radio>
            </Radio.Group>
          </Space>
          </div>
          <div>
           <Button type="primary" danger className="w-min-80">Add</Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default InternalNotes;
