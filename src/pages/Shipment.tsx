import {
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FlagOutlined,
  ReloadOutlined,
  TruckOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Card, Space, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShipmentEditModal, {
  type ShipmentEditValues,
} from "../components/shipment/ShipmentEditModal";
import ShipmentTable from "../components/shipment/ShipmentTable";
import { shipmentDataSource, type ShipmentRecord } from "./shipmentData";

const PAGE_SIZE = 5;

const stats = [
  { label: "Quotes", value: "38", note: "12 awaiting response", dot: "#888" },
  { label: "Booked", value: "64", note: "+8 vs yesterday", dot: "#df2027", positive: true },
  { label: "Pickup Req.", value: "29", note: "5 pending confirmation", dot: "#2f55c7" },
  { label: "In Transit", value: "87", note: "23 out for delivery", dot: "#ff5a1f" },
  { label: "Delivered", value: "29", note: "On-time 96%", dot: "#2fbf71", positive: true },
];

const filters = [
  { label: "Booked", icon: <FileTextOutlined />, active: true },
  { label: "In Transit", icon: <TruckOutlined /> },
  { label: "Delivered", icon: <CheckOutlined /> },
  { label: "Pickup Requested", icon: <ClockCircleOutlined /> },
  { label: "Expired", icon: <ExclamationCircleOutlined /> },
  { label: "Pickup Succeed", icon: <FlagOutlined /> },
  { label: "Pickup Failed", icon: <WarningOutlined /> },
  { label: "Out for Delivery", icon: <TruckOutlined /> },
];

function Shipment() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState(shipmentDataSource);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingShipment, setEditingShipment] = useState<ShipmentRecord | null>(null);

  const setShipmentSelected = (key: string, selected: boolean) => {
    setShipments((currentShipments) =>
      currentShipments.map((shipment) =>
        shipment.key === key ? { ...shipment, selected } : shipment,
      ),
    );
  };

  const setVisibleShipmentsSelected = (keys: string[], selected: boolean) => {
    const visibleKeys = new Set(keys);
    setShipments((currentShipments) =>
      currentShipments.map((shipment) =>
        visibleKeys.has(shipment.key) ? { ...shipment, selected } : shipment,
      ),
    );
  };

  const saveEditedShipment = (values: ShipmentEditValues) => {
    setShipments((currentShipments) =>
      currentShipments.map((shipment) =>
        shipment.key === editingShipment?.key ? { ...shipment, ...values } : shipment,
      ),
    );
    setEditingShipment(null);
  };

  return (
    <section className="shipments-page">
      <div className="shipments-header">
        <div>
          <Typography.Title level={2}>Active Shipments</Typography.Title>
          <Typography.Text>
            218 shipments · <strong>8 require attention</strong> · Last refreshed 42 seconds ago
          </Typography.Text>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button icon={<ClockCircleOutlined />}>Quick Quote</Button>
          <Button type="primary">+ New Shipment</Button>
        </Space>
      </div>

      <div className="shipment-stats">
        {stats.map((stat) => (
          <Card key={stat.label} className="shipment-stat-card">
            <span className="stat-label">
              <i style={{ background: stat.dot }} />
              {stat.label}
            </span>
            <strong>{stat.value}</strong>
            <small className={stat.positive ? "positive" : ""}>{stat.note}</small>
          </Card>
        ))}
      </div>

      <div className="shipment-filters">
        {filters.map((filter) => (
          <Button key={filter.label} className={filter.active ? "active" : ""} icon={filter.icon}>
            {filter.label}
          </Button>
        ))}
      </div>

      <ShipmentTable
        shipments={shipments}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onShipmentSelected={setShipmentSelected}
        onVisibleShipmentsSelected={setVisibleShipmentsSelected}
        onEdit={setEditingShipment}
        onOpenShipment={(key) => navigate(`/shipments/${key}`)}
      />

      <ShipmentEditModal
        shipment={editingShipment}
        onCancel={() => setEditingShipment(null)}
        onSave={saveEditedShipment}
      />
    </section>
  );
}

export default Shipment;
