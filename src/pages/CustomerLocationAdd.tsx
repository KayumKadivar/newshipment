import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import type {
  CustomerLocation,
  LocationAccessorial,
  LocationType,
} from "./customerLocationData";

type LocationFormValues = Omit<CustomerLocation, "key">;

interface CustomerLocationAddProps {
  onCreate: (values: LocationFormValues) => void;
}

const CLIENT_NAME = "INLAND TRANSPORT, INC.";

const ACCESSORIALS: LocationAccessorial[] = [
  "Blind Shipment",
  "Call Before Delivery",
  "Call Before Pickup",
  "Delivery Appointment",
  "Guaranteed By 5PM",
  "Inside Delivery",
  "Inside Pick Up",
  "Liftgate Delivery",
  "Liftgate Pickup",
  "Limited Access Delivery",
  "Limited Access Pickup",
  "Notify Before Delivery",
  "Protect From Freeze",
  "Residential Delivery",
  "Residential Pick Up",
  "Sort and Segregate",
  "Trade Show Delivery",
  "Trade Show Pickup",
  "Hazmat",
  "White Glove Service",
];

const LOCATION_TYPES: LocationType[] = [
  "All",
  "Origin",
  "Destination",
  "Bill to",
];

const GROUP_OPTIONS = [
  "STANDARD",
  "COLD CHAIN",
  "DISTRIBUTION",
  "INTERNAL",
  "MIDWEST",
  "PORTS",
  "SOUTHEAST",
  "WEST COAST",
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  const displayHour = hour % 12 || 12;
  const period = hour < 12 ? "AM" : "PM";

  return {
    value: `${String(hour).padStart(2, "0")}:${minutes}`,
    label: `${displayHour}:${minutes} ${period}`,
  };
});

function getToday() {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function CustomerLocationAdd({ onCreate }: CustomerLocationAddProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<LocationFormValues>();

  const initialValues: Partial<LocationFormValues> = {
    locationName: "",
    shortName: "",
    isActive: true,
    address1: "",
    address2: "",
    country: "United States Of America",
    state: "",
    city: "",
    postal: "",
    port: "",
    contactName: "",
    phone: "",
    phoneExtension: "",
    email: "",
    faxNumber: "",
    activateDate: getToday(),
    deactivateDate: "",
    group: "STANDARD",
    locationType: "All",
    locationRef: "",
    inboundAccount: "",
    outboundAccount: "",
    notes: "",
    openTime: undefined,
    closeTime: undefined,
    accessorials: [],
  };

  const cancel = () => navigate("/customer-location");

  const actions = (placement: "top" | "bottom") => (
    <div className={`add-location-actions add-location-actions--${placement}`}>
      <Button onClick={cancel}>Cancel</Button>
      <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
        Save Location
      </Button>
    </div>
  );

  return (
    <section className='add-location-page'>
      <Form<LocationFormValues>
        form={form}
        className='add-location-form'
        initialValues={initialValues}
        colon={false}
        labelAlign='left'
        labelWrap
        scrollToFirstError
        onFinish={onCreate}>
        {actions("top")}

        <div className='add-location-panels'>
          <section className='add-location-card' aria-labelledby='location-information-title'>
            <h1 id='location-information-title'>Location Information</h1>
            <div className='add-location-card__body'>
              <Form.Item label='Client'>
                <Input value={CLIENT_NAME} readOnly />
              </Form.Item>

              <Form.Item label='Short Name' name='shortName'>
                <Input placeholder='Short name or alias' />
              </Form.Item>

              <Form.Item
                label='Location Name'
                name='locationName'
                required
                rules={[{ required: true, message: "Enter the location name" }]}>
                <Input placeholder='Full location name' />
              </Form.Item>

              <Form.Item
                label='Address 1'
                name='address1'
                required
                rules={[{ required: true, message: "Enter the street address" }]}>
                <Input placeholder='Street address' />
              </Form.Item>

              <Form.Item label='Address 2' name='address2'>
                <Input placeholder='Suite, dock, unit...' />
              </Form.Item>

              <Form.Item label='Country' name='country'>
                <Select
                  options={[
                    {
                      value: "United States Of America",
                      label: "United States Of America",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                className='add-location-field--compact'
                label='Postal'
                name='postal'
                required
                rules={[{ required: true, message: "Enter the ZIP or postal code" }]}>
                <Input placeholder='ZIP / Postal' />
              </Form.Item>

              <Form.Item className='add-location-field--compact' label='State' name='state'>
                <Input placeholder='State / Province' />
              </Form.Item>

              <Form.Item
                label='City'
                name='city'
                required
                rules={[{ required: true, message: "Enter the city" }]}>
                <Input placeholder='City' />
              </Form.Item>

              <Form.Item className='add-location-field--compact' label='Port' name='port'>
                <Input placeholder='Port (optional)' />
              </Form.Item>

              <Form.Item label='Contact Name' name='contactName'>
                <Input placeholder='Contact person' />
              </Form.Item>

              <Form.Item label='Contact Phone'>
                <div className='add-location-phone-row'>
                  <Form.Item name='phone' noStyle>
                    <Input placeholder='(___) ___-____' aria-label='Contact phone' />
                  </Form.Item>
                  <Form.Item name='phoneExtension' noStyle>
                    <Input placeholder='Ext' aria-label='Contact phone extension' />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item
                label='Contact Email'
                name='email'
                rules={[{ type: "email", message: "Enter a valid email address" }]}>
                <Input placeholder='email@company.com' />
              </Form.Item>

              <Form.Item className='add-location-field--medium' label='Fax Number' name='faxNumber'>
                <Input placeholder='Fax number' />
              </Form.Item>
            </div>
          </section>

          <section className='add-location-card' aria-labelledby='location-settings-title'>
            <h1 id='location-settings-title'>Location Settings</h1>
            <div className='add-location-card__body'>
              <Form.Item
                label='Location Type'
                name='locationType'
                required
                rules={[{ required: true, message: "Choose a location type" }]}>
                <Select
                  options={LOCATION_TYPES.map((value) => ({ value, label: value }))}
                />
              </Form.Item>

              <Form.Item label='Group' name='group'>
                <Select
                  options={GROUP_OPTIONS.map((value) => ({ value, label: value }))}
                />
              </Form.Item>

              <Form.Item className='add-location-field--medium' label='Activate Date' name='activateDate'>
                <Input placeholder='MM / DD / YYYY' inputMode='numeric' />
              </Form.Item>

              <Form.Item className='add-location-field--medium' label='Deactivate Date' name='deactivateDate'>
                <Input placeholder='MM / DD / YYYY' inputMode='numeric' />
              </Form.Item>

              <Form.Item label='Is Active' name='isActive' valuePropName='checked'>
                <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
              </Form.Item>

              <Form.Item label='Location Ref.' name='locationRef'>
                <Input placeholder='Reference code' />
              </Form.Item>

              <Form.Item label='Inbound Account' name='inboundAccount'>
                <Input placeholder='Inbound account #' />
              </Form.Item>

              <Form.Item label='Outbound Account' name='outboundAccount'>
                <Input placeholder='Outbound account #' />
              </Form.Item>

              <Form.Item label='Notes' name='notes'>
                <Input.TextArea
                  rows={3}
                  placeholder='Location notes or special instructions...'
                />
              </Form.Item>

              <Form.Item className='add-location-field--medium' label='Open Time' name='openTime'>
                <Select placeholder='-- Select --' allowClear options={TIME_OPTIONS} />
              </Form.Item>

              <Form.Item className='add-location-field--medium' label='Close Time' name='closeTime'>
                <Select placeholder='-- Select --' allowClear options={TIME_OPTIONS} />
              </Form.Item>
            </div>
          </section>
        </div>

        <section className='add-location-card add-location-accessorials' aria-labelledby='accessorials-title'>
          <h1 id='accessorials-title'>Accessorials</h1>
          <div className='add-location-card__body'>
            <Form.Item name='accessorials' noStyle>
              <Checkbox.Group className='add-location-accessorial-grid'>
                {ACCESSORIALS.map((accessorial) => (
                  <Checkbox key={accessorial} value={accessorial}>
                    {accessorial}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
        </section>

        {actions("bottom")}
      </Form>
    </section>
  );
}

export default CustomerLocationAdd;
