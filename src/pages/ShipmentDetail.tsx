import {
  ArrowLeftOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Empty, Spin, Tag, Typography } from "antd";
import {
  GoogleMap,
  PolylineF,
  useLoadScript,
  type Libraries,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import carrierLogo from "../assets/inland1.png";
import AdvancedMapMarker from "../lib/AdvancedMapMarker";
import {
  computeDrivingRoute,
  type ComputedRoute,
  type RouteLocation,
} from "../lib/googleRoutes";
import { shipmentDataSource, type ShipmentRecord } from "./shipmentData";

const apiKeyPlaceholder = "PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE";
const googleLibraries: Libraries = ["marker", "places", "routes"];
const googleMapId =
  (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined) ||
  "DEMO_MAP_ID";
const usCenter = { lat: 39.5, lng: -98.35 };
const mapContainerStyle = { width: "100%", height: "100%" };

function cleanText(value: string) {
  return value.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getDeliveryDate(shipment: ShipmentRecord) {
  const lines = splitLines(shipment.delivery);
  return lines[lines.length - 1] ?? "Pending";
}

function buildAddress(primary: string, meta: string) {
  return cleanText(`${primary} ${meta}`);
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className='shipment-detail-field'>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function DetailCard({
  title,
  children,
  editable = true,
}: {
  title: string;
  children: ReactNode;
  editable?: boolean;
}) {
  return (
    <article className='shipment-detail-card'>
      <div className='shipment-detail-card__head'>
        <h3>{title}</h3>
        {editable ? <EditOutlined /> : null}
      </div>
      <div className='shipment-detail-card__body'>{children}</div>
    </article>
  );
}

function MapPlaceholder({ title, text }: { title: string; text: string }) {
  return (
    <div className='shipment-detail-map-empty'>
      <Typography.Text strong>{title}</Typography.Text>
      <Typography.Text>{text}</Typography.Text>
    </div>
  );
}

function ShipmentRouteMap({ shipment }: { shipment: ShipmentRecord }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [route, setRoute] = useState<ComputedRoute | null>(null);
  const [markers, setMarkers] = useState<RouteLocation[]>([]);
  const [routeError, setRouteError] = useState("");
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined;
  const hasApiKey = Boolean(
    googleMapsApiKey && googleMapsApiKey !== apiKeyPlaceholder,
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey ?? "",
    libraries: googleLibraries,
    version: "beta",
  });

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      fullscreenControl: true,
      mapTypeControl: false,
      mapId: googleMapId,
      streetViewControl: false,
      zoomControl: true,
    }),
    [],
  );

  const originAddress = useMemo(
    () => buildAddress(shipment.origin, shipment.originMeta),
    [shipment.origin, shipment.originMeta],
  );
  const destinationAddress = useMemo(
    () => buildAddress(shipment.destination, shipment.destinationMeta),
    [shipment.destination, shipment.destinationMeta],
  );

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    const points = route?.path.length
      ? route.path
      : markers.map((marker) => marker.position);

    if (!points.length) return;

    let animationFrame = 0;
    let idleListener: google.maps.MapsEventListener | null = null;

    const fitRoute = () => {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds, { top: 22, right: 22, bottom: 22, left: 22 });

      idleListener?.remove();
      idleListener = window.google.maps.event.addListenerOnce(
        map,
        "idle",
        () => {
          const zoom = map.getZoom();
          if (typeof zoom === "number" && zoom > 14) map.setZoom(14);
        },
      );
    };

    const scheduleFit = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(fitRoute);
    };

    scheduleFit();

    const resizeObserver = new ResizeObserver(() => {
      window.google.maps.event.trigger(map, "resize");
      scheduleFit();
    });
    resizeObserver.observe(map.getDiv());

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
      idleListener?.remove();
    };
  }, [map, markers, route]);

  useEffect(() => {
    if (!hasApiKey || !isLoaded || !window.google) {
      return;
    }

    let cancelled = false;
    const routeTimer = window.setTimeout(() => {
      if (cancelled) return;

      setIsRouteLoading(true);
      setRouteError("");
      setRoute(null);
      setMarkers([]);

      const geocodeAddress = (address: string) =>
        new Promise<RouteLocation>((resolve, reject) => {
          new window.google.maps.Geocoder().geocode(
            { address },
            (results, status) => {
              if (
                status === window.google.maps.GeocoderStatus.OK &&
                results?.[0]
              ) {
                const location = results[0].geometry.location;
                resolve({
                  address: results[0].formatted_address,
                  position: { lat: location.lat(), lng: location.lng() },
                });
                return;
              }
              reject(new Error(status));
            },
          );
        });

      const loadRoute = async () => {
        try {
          const computedRoute = await computeDrivingRoute(
            originAddress,
            destinationAddress,
          );
          if (!cancelled) {
            const start = computedRoute.path[0];
            const end = computedRoute.path[computedRoute.path.length - 1];

            setRoute(computedRoute);
            setMarkers([
              { address: `Pickup: ${originAddress}`, position: start },
              { address: `Destination: ${destinationAddress}`, position: end },
            ]);
          }
        } catch (error) {
          console.error("Google driving route request failed.", error);
          try {
            const fallbackMarkers = await Promise.all([
              geocodeAddress(originAddress),
              geocodeAddress(destinationAddress),
            ]);
            if (!cancelled) {
              setMarkers(fallbackMarkers);
              setRouteError("Driving route unavailable, showing stops only.");
            }
          } catch {
            if (!cancelled) {
              setRouteError("Unable to load route for these addresses.");
            }
          }
        } finally {
          if (!cancelled) setIsRouteLoading(false);
        }
      };

      void loadRoute();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(routeTimer);
    };
  }, [destinationAddress, hasApiKey, isLoaded, originAddress]);

  if (!hasApiKey) {
    return (
      <MapPlaceholder
        title='Google Map Preview'
        text='Add VITE_GOOGLE_MAPS_API_KEY to show the shipment route.'
      />
    );
  }

  if (loadError) {
    return (
      <MapPlaceholder
        title='Map failed to load'
        text='Check your Google Maps API key and enabled APIs.'
      />
    );
  }

  if (!isLoaded) {
    return (
      <MapPlaceholder title='Loading Map' text='Preparing shipment route...' />
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={usCenter}
        zoom={4}
        options={mapOptions}
        onLoad={setMap}
        onUnmount={() => setMap(null)}>
        {route ? (
          <PolylineF
            path={route.path}
            options={{
              strokeColor: "#d71920",
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        ) : null}
        {markers.map((marker) => (
          <AdvancedMapMarker
            key={`${marker.address}-${marker.position.lat}`}
            position={marker.position}
            title={marker.address}
          />
        ))}
      </GoogleMap>
      {isRouteLoading ? (
        <div className='shipment-detail-map-loader'>
          <Spin size='small' />
          <span>Loading route...</span>
        </div>
      ) : null}
      {routeError ? (
        <div className='shipment-detail-map-note'>{routeError}</div>
      ) : null}
    </>
  );
}

function ShipmentDetail() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const shipment = shipmentDataSource.find((item) => item.key === shipmentId);

  if (!shipment) {
    return (
      <section className='shipment-detail-page shipment-detail-page--empty'>
        <Empty description='Shipment not found' />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/shipments")}>
          Back to Shipments
        </Button>
      </section>
    );
  }

  const originAddress = buildAddress(shipment.origin, shipment.originMeta);
  const destinationAddress = buildAddress(
    shipment.destination,
    shipment.destinationMeta,
  );
  const deliveryDate = getDeliveryDate(shipment);
  const carrier = cleanText(shipment.carrier);
  const customer = cleanText(shipment.customer);

  return (
    <section className='shipment-detail-page'>
      <div className='shipment-detail-top'>
        <button type='button' onClick={() => navigate("/shipments")}>
          ← All Shipments
        </button>
        <div className='shipment-detail-actions'>
          <Button danger>Cancel Shipment</Button>
          <Button>Copy Quote</Button>
        </div>
      </div>

      <header className='shipment-detail-header'>
        <div>
          <div className='shipment-detail-title-row'>
            <h1>Shipment: {shipment.bol}</h1>
            <Tag className='shipment-detail-pro'>
              Pro&nbsp;&nbsp;{shipment.pro}
            </Tag>
            <Tag color='red' className='shipment-detail-status'>
              • {cleanText(shipment.status)}
            </Tag>
          </div>
          <p>
            {carrier} · LTL <span /> Created:{" "}
            <strong>{shipment.pickupDate}</strong> <span /> Tendered By:{" "}
            <strong>Chuck Hachemeister</strong> <span />
            Created By: <strong>Chuck Hachemeister</strong>
          </p>
        </div>
      </header>

      <nav className='shipment-detail-tabs' aria-label='Shipment detail tabs'>
        {["Details", "Load", "Charges", "Tracking", "Documents", "Audit"].map(
          (tab) => (
            <button
              key={tab}
              type='button'
              className={tab === "Details" ? "active" : ""}>
              {tab}
            </button>
          ),
        )}
      </nav>

      <div className='shipment-detail-layout'>
        <aside className='shipment-detail-left'>
          <div className='shipment-detail-map-card'>
            <ShipmentRouteMap shipment={shipment} />
          </div>

          <article className='shipment-detail-side-card'>
            <DetailField label='Customer' value={customer} />
            <DetailField label='Sales Rep' value='Brian Young' />
            <DetailField label='Sales Group' value='Brian Young (Team)' />
            <h3>Reference Numbers</h3>
            <DetailField label='BOL:' value={shipment.bol} />
            <DetailField label='Carrier Pickup' value={shipment.pro} />
            <DetailField
              label='Carrier Quote Number'
              value={shipment.customerNo}
            />
            <DetailField label='Tracking #' value={shipment.pro} />
            <DetailField
              label='Load'
              value={`${shipment.pallets} pallets · ${shipment.weight}`}
            />
          </article>

          <Alert
            className='shipment-detail-warning'
            type='error'
            showIcon
            icon={<ExclamationCircleOutlined />}
            title='Carrier pickup API error'
            description='Delivery OpenTime is required...'
          />
        </aside>

        <main className='shipment-detail-main'>
          <div className='shipment-detail-grid'>
            <DetailCard title='Pickup'>
              <DetailField
                label='Company name'
                value={`${customer} Warehouse`}
              />
              <DetailField
                label='Address Line 1'
                value={cleanText(shipment.origin)}
              />
              <DetailField
                label='Address Line 2'
                value='Dock Door #9 for PMC Others #10-15'
              />
              <DetailField
                label='City/state/zip'
                value={cleanText(shipment.originMeta)}
              />
              <DetailField label='Contact phone' value='+1 (847) 952-1289' />
            </DetailCard>

            <DetailCard title='Delivery'>
              <DetailField label='Company name' value={`${customer} Company`} />
              <DetailField
                label='Address Line 1'
                value={cleanText(shipment.destination)}
              />
              <DetailField label='Address Line 2' value='Receiving Dock' />
              <DetailField
                label='City/state/zip'
                value={cleanText(shipment.destinationMeta)}
              />
              <DetailField label='Contact phone' value='+1 (937) 262-6243' />
            </DetailCard>

            <DetailCard title='Schedule'>
              <DetailField label='Pickup date' value={shipment.pickupDate} />
              <DetailField label='Pickup time' value='8:00 AM—3:00 PM' />
              <DetailField label='Delivery date' value={deliveryDate} />
              <DetailField label='Delivery time' value='8:00 AM—5:00 PM' />
              <DetailField label='Actual delivery date' value='' />
              <DetailField label='Actual pickup date' value='' />
            </DetailCard>

            <DetailCard title='Booking Info'>
              <DetailField label='Created By' value='Chuck Hachemeister' />
              <DetailField label='Tendered By' value='Chuck Hachemeister' />
            </DetailCard>
          </div>

          <h2 className='shipment-detail-section-title'>Carrier Information</h2>

          <div className='shipment-detail-grid'>
            <DetailCard title='Origin Terminal' editable={false}>
              <DetailField label='Address Line 1' value={originAddress} />
              <DetailField
                label='City/state/zip'
                value={cleanText(shipment.originMeta)}
              />
              <DetailField label='Contact phone' value='+1 (800) 716-6787' />
            </DetailCard>

            <DetailCard title='Destination Terminal' editable={false}>
              <DetailField label='Address Line 1' value={destinationAddress} />
              <DetailField
                label='City/state/zip'
                value={cleanText(shipment.destinationMeta)}
              />
              <DetailField label='Contact phone' value='+1 (614) 921-2121' />
            </DetailCard>

            <article className='shipment-detail-card shipment-detail-carrier-card'>
              <img src={carrierLogo} alt='Carrier logo' />
              <DetailField label='Mode' value='LTL' />
            </article>

            <DetailCard title='Note'>
              <DetailField
                label='Pickup Note'
                value={shipment.carrierNote || "Kowa Ref 20154"}
              />
              <DetailField
                label='Delivery Note'
                value={`PO# ${shipment.customerNo}`}
              />
            </DetailCard>
          </div>
        </main>
      </div>
    </section>
  );
}

export default ShipmentDetail;
