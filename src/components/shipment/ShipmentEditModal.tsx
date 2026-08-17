import { Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import type { ShipmentRecord } from "../../pages/shipmentData";

export type ShipmentEditValues = Omit<ShipmentRecord, "key" | "selected">;

type ShipmentEditModalProps = {
  shipment: ShipmentRecord | null;
  onCancel: () => void;
  onSave: (values: ShipmentEditValues) => void;
};

function ShipmentEditModal({
  shipment,
  onCancel,
  onSave,
}: ShipmentEditModalProps) {
  const [form] = Form.useForm<ShipmentEditValues>();

  useEffect(() => {
    if (shipment) {
      form.setFieldsValue(shipment);
    } else {
      form.resetFields();
    }
  }, [form, shipment]);

  const saveShipment = async () => {
    const values = await form.validateFields();
    onSave({ ...values, pallets: Number(values.pallets) });
  };

  return (
    <Modal
      title='Edit Shipment'
      open={Boolean(shipment)}
      okText='Save'
      onCancel={onCancel}
      onOk={saveShipment}
      destroyOnHidden>
      <Form form={form} layout='vertical' className='shipment-edit-form'>
        <Form.Item
          label='Customer'
          name='customer'
          rules={[{ required: true, message: "Enter customer" }]}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          label='Status'
          name='status'
          rules={[{ required: true, message: "Enter status" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Customer #'
          name='customerNo'
          rules={[{ required: true, message: "Enter customer number" }]}>
          <Input />
        </Form.Item>
        <div className='shipment-edit-grid'>
          <Form.Item
            label='BOL #'
            name='bol'
            rules={[{ required: true, message: "Enter BOL" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label='PRO #'
            name='pro'
            rules={[{ required: true, message: "Enter PRO" }]}>
            <Input />
          </Form.Item>
        </div>
        <div className='shipment-edit-grid'>
          <Form.Item
            label='Pickup Date'
            name='pickupDate'
            rules={[{ required: true, message: "Enter pickup date" }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Delivery' name='delivery'>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
          </Form.Item>
        </div>
        <div className='shipment-edit-grid'>
          <Form.Item
            label='Carrier'
            name='carrier'
            rules={[{ required: true, message: "Enter carrier" }]}>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
          </Form.Item>
          <Form.Item label='Carrier Note' name='carrierNote'>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
          </Form.Item>
        </div>
        <Form.Item
          label='Origin'
          name='origin'
          rules={[{ required: true, message: "Enter origin" }]}>
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
        <Form.Item label='Origin Meta' name='originMeta'>
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
        <Form.Item
          label='Destination'
          name='destination'
          rules={[{ required: true, message: "Enter destination" }]}>
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
        <Form.Item label='Destination Meta' name='destinationMeta'>
          <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
        </Form.Item>
        <div className='shipment-edit-grid'>
          <Form.Item
            label='Pallets'
            name='pallets'
            rules={[{ required: true, message: "Enter pallet count" }]}>
            <InputNumber min={0} precision={0} />
          </Form.Item>
          <Form.Item
            label='Weight'
            name='weight'
            rules={[{ required: true, message: "Enter weight" }]}>
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default ShipmentEditModal;
