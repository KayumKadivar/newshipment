import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface AuditRecord {
  key: string;
  name: string;
  email: string;
  change: string;
  action: string;
  date: string;
}

const auditData: AuditRecord[] = [
  {
    key: '1',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Details',
    action: 'Delivery contact phone update',
    date: '4/25/2026',
  },
  {
    key: '2',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Load',
    action: 'Pallet count updated',
    date: '4/25/2026',
  },
  {
    key: '3',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Load',
    action: 'Pallet weight updated',
    date: '4/25/2026',
  },
  {
    key: '4',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Charges',
    action: 'Fuel surcharge updated',
    date: '4/25/2026',
  },
  {
    key: '5',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Documents',
    action: 'Bill of Lading updated',
    date: '4/25/2026',
  },
  {
    key: '6',
    name: 'Brian Young',
    email: 'brianyoung@inland.com',
    change: 'Tracking',
    action: 'Tracking reminder added',
    date: '4/25/2026',
  },
];

function Audit() {
  const columns: ColumnsType<AuditRecord> = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (_, record) => (
        <span className="bol-cell">
          <strong>{record.name}</strong>
          <small>{record.email}</small>
        </span>
      ),
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (text) => <span className="cell-strong">{text}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => (
        <span className="audit-action-cell">
          {text} <ArrowUpOutlined className="action-arrow-icon" />
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span className="cell-strong">{text}</span>,
    },
    {
      title: 'Action',
      key: 'edit',
      width: 50,
      render: () => <Button size="small" type="text" icon={<EditOutlined />} />,
    },
  ];

  return (
    <div className="shipment-table-card">
      <Table<AuditRecord>
        columns={columns} 
        dataSource={auditData} 
        pagination={false} 
        rowClassName={() => 'shipment-clickable-row'}
      />
    </div>
  );
}

export default Audit;
