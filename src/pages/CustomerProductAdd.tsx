import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { CustomerProduct } from "./customerProductData";

type ProductFormValues = Omit<CustomerProduct, "key">;

interface CustomerProductAddProps {
  onCreate: (values: ProductFormValues) => void;
}

const PRODUCT_CLASSES = [
  "50",
  "55",
  "60",
  "65",
  "70",
  "77.5",
  "85",
  "92.5",
  "100",
  "110",
  "125",
  "150",
  "175",
  "200",
  "250",
  "300",
  "400",
  "500",
];

function CustomerProductAdd({ onCreate }: CustomerProductAddProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductFormValues>();
  const isHazmat = Form.useWatch("isHazmat", form) ?? false;

  const initialValues: ProductFormValues = {
    description: "",
    isActive: true,
    nmfc: "",
    productClass: "",
    commodity: "",
    isHazmat: false,
    hazmatContact: "",
    length: 0,
    height: 0,
    weight: 0,
    width: 0,
    productGroup: "STANDARD",
    notes: "",
    isApproved: true,
  };

  return (
    <section className='add-location-page add-product-page'>
      <Form<ProductFormValues>
        form={form}
        className='add-location-form add-product-form'
        initialValues={initialValues}
        colon={false}
        labelAlign='left'
        labelWrap
        scrollToFirstError
        onFinish={onCreate}>
        <div className='add-location-actions add-location-actions--top'>
          <Button onClick={() => navigate("/customer-products")}>Cancel</Button>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
            Save Product
          </Button>
        </div>

        <div className='add-location-panels add-product-panels'>
          <section className='add-location-card' aria-labelledby='product-details-title'>
            <h1 id='product-details-title'>Product Details</h1>
            <div className='add-location-card__body'>
              <Form.Item label='Client'>
                <Input value='INLAND TRANSPORT, INC.' readOnly />
              </Form.Item>

              <Form.Item
                label='Description'
                name='description'
                required
                rules={[{ required: true, message: "Enter a product description" }]}>
                <Input placeholder='Product description' />
              </Form.Item>

              <Form.Item label='NMFC'>
                <div className='add-product-nmfc-row'>
                  <Form.Item name='nmfc' noStyle>
                    <Input placeholder='e.g. 34550' aria-label='NMFC' />
                  </Form.Item>
                  <span>e.g. XXXXXX-XX</span>
                </div>
              </Form.Item>

              <Form.Item
                className='add-location-field--medium'
                label='Product Class'
                name='productClass'>
                <Select
                  allowClear
                  placeholder='-- Select --'
                  options={PRODUCT_CLASSES.map((value) => ({ value, label: value }))}
                />
              </Form.Item>

              <Form.Item label='Commodity' name='commodity'>
                <Input placeholder='Commodity description' />
              </Form.Item>

              <Form.Item label='Hazmat'>
                <div className='add-product-switch-row'>
                  <Form.Item name='isHazmat' valuePropName='checked' noStyle>
                    <Switch aria-label='Hazmat product' />
                  </Form.Item>
                  <strong>{isHazmat ? "Yes" : "No"}</strong>
                </div>
              </Form.Item>

              <Form.Item label='Notes' name='notes'>
                <Input.TextArea rows={3} placeholder='Additional product notes...' />
              </Form.Item>
            </div>
          </section>

          <section className='add-location-card' aria-labelledby='product-settings-title'>
            <h1 id='product-settings-title'>Specifications &amp; Settings</h1>
            <div className='add-location-card__body'>
              <Form.Item label='Product Group' name='productGroup'>
                <Select options={[{ value: "STANDARD", label: "STANDARD" }]} />
              </Form.Item>

              <Form.Item label='Product Length'>
                <div className='add-product-unit-row'>
                  <Form.Item name='length' noStyle>
                    <InputNumber
                      min={0}
                      precision={2}
                      aria-label='Product length in inches'
                    />
                  </Form.Item>
                  <span>in</span>
                </div>
              </Form.Item>

              <Form.Item label='Product Height'>
                <div className='add-product-unit-row'>
                  <Form.Item name='height' noStyle>
                    <InputNumber
                      min={0}
                      precision={2}
                      aria-label='Product height in inches'
                    />
                  </Form.Item>
                  <span>in</span>
                </div>
              </Form.Item>

              <Form.Item label='Product Weight'>
                <div className='add-product-unit-row'>
                  <Form.Item name='weight' noStyle>
                    <InputNumber
                      min={0}
                      precision={2}
                      aria-label='Product weight in pounds'
                    />
                  </Form.Item>
                  <span>lbs</span>
                </div>
              </Form.Item>

              <Form.Item label='Product Width'>
                <div className='add-product-unit-row'>
                  <Form.Item name='width' noStyle>
                    <InputNumber
                      min={0}
                      precision={2}
                      aria-label='Product width in inches'
                    />
                  </Form.Item>
                  <span>in</span>
                </div>
              </Form.Item>

              <Form.Item label='Is Active'>
                <div className='add-product-switch-row'>
                  <Form.Item name='isActive' valuePropName='checked' noStyle>
                    <Switch aria-label='Active product' />
                  </Form.Item>
                  <strong>Active</strong>
                </div>
              </Form.Item>

              <Form.Item label='Approve' name='isApproved'>
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </section>
        </div>
      </Form>
    </section>
  );
}

export default CustomerProductAdd;
