import {
  AppstoreOutlined,
  CaretUpOutlined,
  FileTextOutlined,
  HomeOutlined,
  TeamOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Typography, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import avatarImage from "../assets/avtar.png";
import nicoSidebarLogo from "../assets/side-head.png";

const { Sider } = Layout;

const menuItems: NonNullable<MenuProps["items"]> = [
  { key: "/", icon: <HomeOutlined />, label: "Home" },

  { key: "/shipments", icon: <TruckOutlined />, label: "Shipments" },
  { key: "/quotes", icon: <FileTextOutlined />, label: "Quotes" },
  {
    key: "/customer-location",
    icon: <TeamOutlined />,
    label: "Customer Location",
  },
  {
    key: "/customer-products",
    icon: <AppstoreOutlined />,
    label: "Customer Products",
  },
];

type SidebarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey =
    location.pathname.startsWith("/shipments")
      ? "/shipments"
      : location.pathname.startsWith("/quotes")
        ? "/quotes"
      : location.pathname.startsWith("/customer-location")
        ? "/customer-location"
        : location.pathname.startsWith("/customer-products")
          ? "/customer-products"
          : location.pathname;

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(String(key));
  };

  return (
    <Sider
      breakpoint='lg'
      collapsed={collapsed}
      collapsible
      collapsedWidth={72}
      trigger={null}
      width={240}
      onBreakpoint={onCollapsedChange}
      className='app-sider'>
      <div className={`sider-brand ${collapsed ? "collapsed" : ""}`}>
        <img src={nicoSidebarLogo} alt='NICO Power of Electricals' />
      </div>

      {!collapsed ? (
        <div className='sidebar-section-label'>Workspace</div>
      ) : null}

      <Menu
        theme='dark'
        mode='inline'
        items={menuItems}
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        className='app-menu'
      />

      <button className='sider-profile' type='button'>
        <Avatar className='sider-profile__avatar' src={avatarImage} />
        {!collapsed ? (
          <>
            <span className='sider-profile__meta'>
              <Typography.Text className='sider-profile__name'>
                Brian Young
              </Typography.Text>
              <Typography.Text className='sider-profile__role'>
                Dispatcher · FL Hub
              </Typography.Text>
            </span>
            <CaretUpOutlined className='sider-profile__caret' />
          </>
        ) : null}
      </button>
    </Sider>
  );
}

export default Sidebar;
