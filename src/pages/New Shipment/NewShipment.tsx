import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addProductRow, removeProductRow, updateProductRow, setWeightUnit, type ProductItem } from '../../store/productSlice';
import {
  Button, Card, Input, Segmented, Checkbox,
  Row, Col, Flex,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './newshipment.css';
import OriginLocation from './OriginLocation';
import DestinationLocation from './DestinationLocation';
import ShipmentInformation from './ShipmentInformation';
import Accessorials from './Accessorials';
import CustomerRate from './CustomerRate';
import BillToLocation from './BillToLocation';
import InternalNotes from './InternalNotes';
import InsuranceInfo from './InsuranceInfo';

const NewShipment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Manage multiple product lines from Redux
  const items = useAppSelector((state) => state.product.items);
  const weightUnit = useAppSelector((state) => state.product.weightUnit);

  const handleAddLine = () => {
    dispatch(addProductRow());
  };

  const handleRemoveLine = (idToRemove: string) => {
    if (items.length > 1) {
      dispatch(removeProductRow(idToRemove));
    }
  };


  const handleUpdateField = (id: string, field: keyof ProductItem, value: any) => {
    dispatch(updateProductRow({ id, field, value }));
  };

  const totalPallets = items.reduce((sum, item) => sum + (Number(item.pallets) || 0), 0);
  const totalPieces = items.reduce((sum, item) => sum + (Number(item.pieces) || 0), 0);
  const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);

  return (
    <div className="new-shipment-container">

      {/* ── PAGE HEADER ── */}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16} className="ns-page-header">
        <div>
          <h1 className="ns-page-title">New Shipment</h1>
          <Flex align="center" gap={10} >
            <span>Client:</span>
            <strong>INLAND TRANSPORT, INC.</strong>
            <span className='ns-credit-limit'>Credit limit: $0</span>
          </Flex>
        </div>
        <Flex gap={12}>
          <Button danger onClick={() => navigate('/shipments')}>Cancel</Button>
          <Button>Save Quote</Button>
          <Button type="primary" danger>Save Shipment</Button>
        </Flex>
      </Flex>

      {/* ══ Top Layout ══ */}
      <Row gutter={[16, 16]} align="stretch" className="ns-top-row">
        <Col xs={24} xl={16}>
          <Flex vertical gap={16} className="ns-left-col">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}><OriginLocation /></Col>
              <Col xs={24} md={12}><DestinationLocation /></Col>
            </Row>
            <Card
              title={
                <Flex align="center" gap={8}>
                  Notes <DownOutlined className="ns-notes-icon" />
                </Flex>
              }
              className="notes-panel"
            >
              <Input.TextArea
                placeholder="Add shipment notes, special instructions, or internal comments..."
                className="notes-textarea"
              />
            </Card>
          </Flex>
        </Col>

        <Col xs={24} xl={8}>
          <Flex vertical gap={16}>
            <ShipmentInformation />
            <Accessorials />
          </Flex>
        </Col>
      </Row>

      {/* ══ Product Table ══ */}
      <Card
        title="Product"
        className="product-panel ns-product-card"
        extra={
          <Flex align="center" gap={8} className="ns-product-extra">
            <span>Weight Unit</span>
            <Segmented 
              options={['Lbs', 'Kgs']} 
              value={weightUnit} 
              onChange={(val) => dispatch(setWeightUnit(val as "Lbs" | "Kgs"))} 
            />
          </Flex>
        }
      >
        <div className="product-table-wrapper">
          <div className="product-table">
            <div className="product-header-row">
            <div className="col-60">Pallets</div>
            <div className="col-60">Pieces</div>
            <div className="col-100">Package</div>
            <div className="col-flex-1">Description</div>
            <div className="col-70 text-center">Stackable</div>
            <div className="col-60 text-center">Hazmat</div>
            <div className="col-80">NMFC</div>
            <div className="col-180">Dimension (in) L/W/H</div>
            <div className="col-80">PCF/Density</div>
            <div className="col-60">Class</div>
            <div className="col-80">Weight</div>
            <div className="col-24"></div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="product-input-row">
              <div className="col-60"><Input value={item.pallets} onChange={(e) => handleUpdateField(item.id, 'pallets', e.target.value)} className="input-center" /></div>
              <div className="col-60"><Input value={item.pieces} onChange={(e) => handleUpdateField(item.id, 'pieces', e.target.value)} className="input-center" /></div>
              <div className="col-100"><Input value={item.packageType} onChange={(e) => handleUpdateField(item.id, 'packageType', e.target.value)} /></div>
              <div className="col-flex-1"><Input placeholder="Description" value={item.description} onChange={(e) => handleUpdateField(item.id, 'description', e.target.value)} /></div>
              <div className="col-70 flex-center"><Checkbox checked={item.stackable} onChange={(e) => handleUpdateField(item.id, 'stackable', e.target.checked)} /></div>
              <div className="col-60 flex-center"><Checkbox checked={item.hazmat} onChange={(e) => handleUpdateField(item.id, 'hazmat', e.target.checked)} /></div>
              <div className="col-80"><Input placeholder="NMFC" value={item.nmfc} onChange={(e) => handleUpdateField(item.id, 'nmfc', e.target.value)} /></div>
              <Flex align="center" gap={4} className="col-180">
                <Input placeholder="L" className="dim-input" value={item.length || ''} onChange={(e) => handleUpdateField(item.id, 'length', e.target.value)} />
                <Input placeholder="W" className="dim-input" value={item.width || ''} onChange={(e) => handleUpdateField(item.id, 'width', e.target.value)} />
                <Input placeholder="H" className="dim-input" value={item.height || ''} onChange={(e) => handleUpdateField(item.id, 'height', e.target.value)} />
                <span className="unit-text">in</span>
              </Flex>
              <div className="col-80"><Input value={item.pcfDensity} onChange={(e) => handleUpdateField(item.id, 'pcfDensity', e.target.value)} className="input-right" /></div>
              <div className="col-60"><Input value={item.class} onChange={(e) => handleUpdateField(item.id, 'class', e.target.value)} className="input-center" /></div>
              <Flex align="center" gap={4} className="col-80">
                <Input value={item.weight} onChange={(e) => handleUpdateField(item.id, 'weight', e.target.value)} className="input-right" />
                <span className="unit-text">{weightUnit.toLowerCase()}</span>
              </Flex>
              <div className="col-24 flex-center">
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  className="ns-row-delete-btn" 
                  size="small" 
                  onClick={() => handleRemoveLine(item.id)}
                  disabled={items.length === 1}
                />
              </div>
            </div>
          ))}

          <div className="product-summary-row">
            <div className="col-60 text-center">{totalPallets}</div>
            <div className="col-60 text-center">{totalPieces}</div>
            <div className="col-100"></div>
            <div className="col-flex-1"></div>
            <div className="col-70"></div>
            <div className="col-60"></div>
            <div className="col-80"></div>
            <div className="col-180"></div>
            <div className="col-80"></div>
            <div className="col-60"></div>
            <div className="col-80 text-right">{totalWeight} {weightUnit.toLowerCase()}</div>
            <div className="col-24"></div>
          </div>

            <div className="ns-add-line-wrap">
              <Button type="link" danger icon={<PlusOutlined />} className="ns-add-line-btn" onClick={handleAddLine}>
                Add Line
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ══ Bottom 4-cell grid ══ */}
      <Row gutter={[16, 16]} align="stretch" className="ns-bottom-row">
        <Col xs={24} xl={16}><CustomerRate /></Col>
        <Col xs={24} xl={8}><BillToLocation /></Col>

        <Col xs={24} xl={16}><InsuranceInfo /></Col>

        <Col xs={24} xl={8} className="ns-internal-col">
          <InternalNotes />
        </Col>
      </Row>

      {/* ══ FOOTER BUTTONS ══ */}
      <Flex justify="flex-end" gap={12} wrap="wrap">
        <Button onClick={() => navigate('/shipments')} className="btn-outline">✕ Close</Button>
        <Button className="btn-outline">Save Quote</Button>
        <Button type="primary" danger>Save Shipment</Button>
      </Flex>

    </div>
  );
};

export default NewShipment;
