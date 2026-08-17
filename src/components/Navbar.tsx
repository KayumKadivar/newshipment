import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Input, Layout, Space, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { shipmentDataSource } from "../pages/shipmentData";

const { Header } = Layout;

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/shipments": "Shipments",
  "/about": "About",
  "/quotes": "Quotes",
  "/contact": "Contact",
  "/customer-location": "Customer Location",
  "/customer-products": "Customer Products",
};

type NavbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
};

function Navbar({ collapsed, onToggleSidebar, onLogout }: NavbarProps) {
  const location = useLocation();
  const shipmentDetailId = location.pathname.match(
    /^\/shipments\/([^/]+)$/,
  )?.[1];
  const shipmentDetail = shipmentDataSource.find(
    (shipment) => shipment.key === shipmentDetailId,
  );
  const pageTitle = location.pathname === "/quotes/rate" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Shipments</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <span>New Quote</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>Rates</strong>
    </span>
  ) : location.pathname === "/quotes" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Shipments</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>New Quote</strong>
    </span>
  ) : shipmentDetailId ? (
    <span className='top-navbar__breadcrumb'>
      <span>Shipments</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>{shipmentDetail?.bol ?? shipmentDetailId}</strong>
    </span>
  ) : location.pathname === "/customer-location/add" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Customer Location</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <span>Location Detail</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>Add Location</strong>
    </span>
  ) : location.pathname === "/customer-location" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Customer Location</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>Location Detail</strong>
    </span>
  ) : location.pathname === "/customer-products/add" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Customer Product</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <span>Product Detail</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>Add Product</strong>
    </span>
  ) : location.pathname === "/customer-products" ? (
    <span className='top-navbar__breadcrumb'>
      <span>Customer Product</span>
      <span className='top-navbar__breadcrumb-separator'>&gt;</span>
      <strong>Product Detail</strong>
    </span>
  ) : location.pathname.startsWith("/shipments") ? (
    "Shipments"
  ) : (
    (pageTitles[location.pathname] ?? "Shipments")
  );

  return (
    <Header className='top-navbar'>
      <Space size='middle' className='top-navbar__left'>
        <Button
          type='text'
          className='collapse-trigger'
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
        />
        <Typography.Text className='top-navbar__page'>
          {pageTitle}
        </Typography.Text>
      </Space>

      <div className='top-navbar__right'>
        <Input
          className='top-search'
          prefix={<SearchOutlined />}
          placeholder='Search shippers, zip, quote ID, etc...'
          allowClear
        />
        <Button
          type='text'
          className='top-icon-button'
          icon={<QuestionCircleOutlined />}
        />
        <Button
          type='text'
          className='top-icon-button top-icon-button--notify'
          icon={<BellOutlined />}
        />
        <Button
          type='text'
          className='top-icon-button'
          icon={<SettingOutlined />}
        />
        <Button
          className='top-logout-button'
          icon={<LogoutOutlined />}
          onClick={onLogout}>
          Logout
        </Button>
        <Button
          className='mobile-new-button'
          type='primary'
          icon={<PlusOutlined />}>
          New
        </Button>
      </div>
    </Header>
  );
}

export default Navbar;
