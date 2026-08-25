import type { Dispatch, SetStateAction } from "react";
import { Route, Routes } from "react-router-dom";
// import About from "../pages/About.tsx";
// import Contact from "../pages/Contact.tsx";
import CustomerLocationAdd from "../pages/CustomerLocationAdd.tsx";
import CustomerLocationPage from "../pages/CustomerLocation.tsx";
import type { CustomerLocation } from "../pages/customerLocationData.ts";
import CustomerProductAdd from "../pages/CustomerProductAdd.tsx";
import CustomerProductPage from "../pages/CustomerProduct.tsx";
import type { CustomerProduct } from "../pages/customerProductData.ts";
import Home from "../pages/Home.tsx";
import NewQuote from "../pages/NewQuote.tsx";
import NotFound from "../pages/NotFound.tsx";
import Rate from "../pages/Rate.tsx";
import Shipment from "../pages/Shipment.tsx";
import ShipmentDetail from "../pages/ShipmentDetail.tsx";
import NewShipment from "../pages/New Shipment/NewShipment.tsx";

type AppRouterProps = {
  customerLocations: CustomerLocation[];
  setCustomerLocations: Dispatch<SetStateAction<CustomerLocation[]>>;
  customerProducts: CustomerProduct[];
  setCustomerProducts: Dispatch<SetStateAction<CustomerProduct[]>>;
  onCreateLocation: (values: Omit<CustomerLocation, "key">) => void;
  onCreateProduct: (values: Omit<CustomerProduct, "key">) => void;
};

export default function AppRouter({
  customerLocations,
  setCustomerLocations,
  customerProducts,
  setCustomerProducts,
  onCreateLocation,
  onCreateProduct,
}: AppRouterProps) {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/shipments' element={<Shipment />} />
      <Route path="/shipments/new" element={<NewShipment />} />
      <Route path='/shipments/:shipmentId' element={<ShipmentDetail />} />
      {/* <Route path='/about' element={<About />} /> */}
      <Route path='/quotes' element={<NewQuote />} />
      <Route path='/quotes/rate' element={<Rate />} />
      {/* <Route path='/contact' element={<Contact />} /> */}
      <Route
        path='/customer-location'
        element={
          <CustomerLocationPage
            locations={customerLocations}
            setLocations={setCustomerLocations}
          />
        }
      />
      <Route
        path='/customer-location/add'
        element={<CustomerLocationAdd onCreate={onCreateLocation} />}
      />
      <Route
        path='/customer-products'
        element={
          <CustomerProductPage
            products={customerProducts}
            setProducts={setCustomerProducts}
          />
        }
      />
      <Route
        path='/customer-products/add'
        element={<CustomerProductAdd onCreate={onCreateProduct} />}
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
