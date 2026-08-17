import {
  AppstoreOutlined,
  BarsOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  GoogleMap,
  PolylineF,
  useLoadScript,
  type Libraries,
} from "@react-google-maps/api";
import { Button, Empty, Input, Select, Spin, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import abfLogo from "../assets/image 55.png";
import rlLogo from "../assets/image 57.png";
import SendRatesDialog, {
  type SendRateItem,
} from "../components/rate/SendRatesDialog";
import AdvancedMapMarker from "../lib/AdvancedMapMarker";
import {
  computeDrivingRoute,
  type ComputedRoute,
  type RouteLocation,
} from "../lib/googleRoutes";

type CarrierRate = SendRateItem & {
  warning: string;
  quoteExpiry: string;
  liabilityNew: string;
  liabilityUsed: string;
};

type SortOption = "rate-asc" | "rate-desc" | "transit";
type QuoteMode = "ltl" | "volume";
type ViewMode = "list" | "grid";

const apiKeyPlaceholder = "PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE";
const googleLibraries: Libraries = ["marker", "places", "routes"];
const googleMapId =
  (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined) ||
  "DEMO_MAP_ID";
const mapContainerStyle = { width: "100%", height: "100%" };
const usCenter = { lat: 39.5, lng: -98.35 };

const originAddress = "Chandler, Arizona 85225, US";
const destinationAddress = "Southington, Connecticut 06489, US";

const carrierRates: CarrierRate[] = [
  {
    id: "abf",
    name: "ABF FREIGHT",
    code: "ABFS",
    service: "STANDARD RATE",
    price: 435.06,
    warning:
      "No Sysco Foods deliveries. NO ALCOHOL · No Graphite · No Ammunition · No Assembled Guns · No Vape or Hemp products.",
    quoteExpiry: "4/22/2026",
    transitDays: 6,
    estimatedDelivery: "4/23/2026",
    liabilityNew: "$3,425.00",
    liabilityUsed: "$68.50",
    logo: abfLogo,
    logoKind: "image",
  },
  {
    id: "rl",
    name: "R&L CARRIERS",
    code: "RLCA",
    service: "STANDARD RATE",
    price: 502.63,
    warning:
      "NO MEIJER DCs. NO VAPE PRODUCTS, THC, CBD, or HEMP · NO WAL-MART DCs in USA · Will handle WALMART DCs in Canada · NO AMAZON DCs · NO SYSCO · NO FIREARMS.",
    quoteExpiry: "4/17/2026",
    transitDays: 5,
    estimatedDelivery: "4/22/2026",
    liabilityNew: "$8,220.00",
    liabilityUsed: "$68.50",
    logo: rlLogo,
    logoKind: "image",
  },
  {
    id: "fedex",
    name: "FedEx FREIGHT",
    code: "FXNL",
    service: "ECONOMY",
    price: 589.4,
    warning:
      "No Firearms without carrier approval · No Tobacco · NO AMAZON.",
    quoteExpiry: "4/21/2026",
    transitDays: 7,
    estimatedDelivery: "4/24/2026",
    liabilityNew: "$17,125.00",
    liabilityUsed: "$68.50",
    logoKind: "fedex",
  },
];

function formatDistance(distanceMeters?: number) {
  if (typeof distanceMeters !== "number") return "2,516 miles";
  return `${Math.round(distanceMeters / 1609.344).toLocaleString("en-US")} miles`;
}

function RateMap() {
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

  useEffect(() => {
    if (!hasApiKey || !isLoaded || !window.google) return;

    let cancelled = false;
    setIsRouteLoading(true);
    setRouteError("");

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
        if (cancelled) return;

        const start = computedRoute.path[0];
        const end = computedRoute.path[computedRoute.path.length - 1];
        setRoute(computedRoute);
        setMarkers([
          { address: `From: ${originAddress}`, position: start },
          { address: `To: ${destinationAddress}`, position: end },
        ]);
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
            setRouteError("Unable to load this route.");
          }
        }
      } finally {
        if (!cancelled) setIsRouteLoading(false);
      }
    };

    void loadRoute();
    return () => {
      cancelled = true;
    };
  }, [hasApiKey, isLoaded]);

  useEffect(() => {
    if (!map || !window.google) return;

    const points = route?.path.length
      ? route.path
      : markers.map((marker) => marker.position);
    if (!points.length) return;

    let animationFrame = 0;
    const fitRoute = () => {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((point) => bounds.extend(point));
      map.fitBounds(bounds, { top: 26, right: 26, bottom: 26, left: 26 });
    };
    const scheduleFit = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(fitRoute);
    };

    scheduleFit();
    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(map.getDiv());

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [map, markers, route]);

  if (!hasApiKey) {
    return (
      <div className='rate-map-placeholder'>
        <strong>Google Map Preview</strong>
        <span>Add VITE_GOOGLE_MAPS_API_KEY to display the route.</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className='rate-map-placeholder'>
        <strong>Map failed to load</strong>
        <span>Check the API key and enabled Google Maps APIs.</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className='rate-map-placeholder'>
        <Spin size='small' />
        <span>Loading route...</span>
      </div>
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
              strokeColor: "#2879dc",
              strokeOpacity: 0.92,
              strokeWeight: 4,
            }}
          />
        ) : null}
        {markers.map((marker) => (
          <AdvancedMapMarker
            key={marker.address}
            position={marker.position}
            title={marker.address}
          />
        ))}
      </GoogleMap>
      <span className='rate-map-distance'>{formatDistance(route?.distanceMeters)}</span>
      {isRouteLoading ? (
        <span className='rate-map-status'>Loading route...</span>
      ) : null}
      {routeError ? <span className='rate-map-status'>{routeError}</span> : null}
    </>
  );
}

function CarrierLogo({ rate }: { rate: CarrierRate }) {
  if (rate.logoKind === "fedex") {
    return (
      <div className='rate-fedex-logo' aria-label='FedEx Freight'>
        <span>Fed</span>
        <strong>Ex</strong>
      </div>
    );
  }

  return <img src={rate.logo} alt={`${rate.name} logo`} />;
}

function CarrierCard({
  rate,
  checked,
  onCheckedChange,
  onSend,
}: {
  rate: CarrierRate;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onSend: () => void;
}) {
  return (
    <article className={`rate-card ${checked ? "rate-card--selected" : ""}`}>
      <div className='rate-card__warning'>
        <ExclamationCircleOutlined />
        <span>{rate.warning}</span>
      </div>

      <div className='rate-card__body'>
        <div className='rate-card__offer'>
          <div className='rate-card__logo'>
            <CarrierLogo rate={rate} />
          </div>
          <strong className='rate-card__price'>
            {rate.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
          <Button
            type={checked ? "primary" : "default"}
            className='rate-card__select'
            onClick={() => onCheckedChange(!checked)}>
            {checked ? "Selected" : "Select Quote"}
          </Button>
        </div>

        <div className='rate-card__information'>
          <div className='rate-card__heading'>
            <div className='rate-card__identity'>
              <strong>{rate.name}</strong>
              <span className='rate-chip'>{rate.code}</span>
              <span
                className={`rate-chip ${
                  rate.service === "ECONOMY" ? "rate-chip--blue" : ""
                }`}>
                {rate.service}
              </span>
            </div>
            <div className='rate-card__quick-actions'>
              <button type='button' onClick={onSend}>
                <SendOutlined /> Send
              </button>
              <button type='button'>
                <HomeOutlined /> Terminals
              </button>
              <button type='button'>
                <InfoCircleOutlined /> Info
              </button>
            </div>
          </div>

          <dl className='rate-card__details'>
            <div className='rate-detail-expiry'>
              <dt>Quote Exp. Date</dt>
              <dd>{rate.quoteExpiry}</dd>
            </div>
            <div className='rate-detail-transit'>
              <dt>Transit Days</dt>
              <dd>{rate.transitDays} business days</dd>
            </div>
            <div className='rate-detail-delivery'>
              <dt>Est. Delivery Date</dt>
              <dd>{rate.estimatedDelivery}</dd>
            </div>
            <div className='rate-detail-liability-new'>
              <dt>Carrier Liability New</dt>
              <dd>{rate.liabilityNew}</dd>
            </div>
            <div className='rate-detail-liability-used'>
              <dt>Carrier Liability Used</dt>
              <dd>{rate.liabilityUsed}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

function Rate() {
  const navigate = useNavigate();
  const [messageApi, messageContext] = message.useMessage();
  const [quoteMode, setQuoteMode] = useState<QuoteMode>("ltl");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rate-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedRates, setSelectedRates] = useState<string[]>([]);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [sendRecipients, setSendRecipients] = useState<string[]>([""]);
  const [sendRateIds, setSendRateIds] = useState<string[]>([]);
  const [sendValidationError, setSendValidationError] = useState("");

  const visibleRates = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = carrierRates.filter((rate) =>
      [rate.name, rate.code, rate.service].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );

    return [...matches].sort((first, second) => {
      if (sortBy === "rate-desc") return second.price - first.price;
      if (sortBy === "transit") return first.transitDays - second.transitDays;
      return first.price - second.price;
    });
  }, [search, sortBy]);

  const setRateChecked = (rate: CarrierRate, checked: boolean) => {
    setSelectedRates((current) =>
      checked
        ? current.includes(rate.id)
          ? current
          : [...current, rate.id]
        : current.filter((id) => id !== rate.id),
    );
  };

  const closeSendDialog = () => {
    setIsSendDialogOpen(false);
    setSendRecipients([""]);
    setSendRateIds([]);
    setSendValidationError("");
  };

  const openSendDialog = (rateIds: string[] = []) => {
    setSendRecipients([""]);
    setSendRateIds(rateIds);
    setSendValidationError("");
    setIsSendDialogOpen(true);
  };

  const sendRates = () => {
    const enteredRecipients = sendRecipients
      .map((recipient) => recipient.trim())
      .filter(Boolean);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!enteredRecipients.length) {
      setSendValidationError("Add at least one recipient email address.");
      return;
    }

    if (enteredRecipients.some((recipient) => !emailPattern.test(recipient))) {
      setSendValidationError("Enter a valid email address for every recipient.");
      return;
    }

    if (!sendRateIds.length) {
      setSendValidationError("Select at least one rate to send.");
      return;
    }

    messageApi.success(
      `${sendRateIds.length} ${sendRateIds.length === 1 ? "rate" : "rates"} sent to ${enteredRecipients.length} ${enteredRecipients.length === 1 ? "recipient" : "recipients"}`,
    );
    closeSendDialog();
  };

  return (
    <section className='rate-page'>
      {messageContext}

      <button
        type='button'
        className='rate-back-button'
        onClick={() => navigate("/quotes")}>
        &larr; All Quotes
      </button>

      <header className='rate-page__header'>
        <h1>Quote: 60113985278</h1>
        <div className='rate-page__header-actions'>
          <Button onClick={() => messageApi.info("Quote editing is not connected yet.")}>
            Edit Quote
          </Button>
          <Button
            danger
            onClick={() => messageApi.info("Quote deletion is not connected yet.")}>
            Delete Quote
          </Button>
        </div>
      </header>

      <div className='rate-capacity-warning' role='alert'>
        <ExclamationCircleOutlined />
        <span>
          Your quote exceeds some carrier capacity rules, so we didn't include
          those carriers in this list.
        </span>
      </div>

      <div className='rate-content-grid'>
        <aside className='rate-context'>
          <article className='rate-route-card'>
            <div className='rate-route-card__map'>
              <RateMap />
            </div>
            <div className='rate-route-card__summary'>
              <div>
                <span>FROM</span>
                <strong>{originAddress}</strong>
                <small>04/15/2026</small>
              </div>
              <div>
                <span>TO</span>
                <strong>{destinationAddress}</strong>
              </div>
            </div>
          </article>

          <article className='rate-items-card'>
            <h2>ITEMS</h2>
            <div className='rate-items-card__body'>
              <strong className='rate-item-pill'>1 PALLET · CLASS 85</strong>
              <dl>
                <div>
                  <dt>Piece(s)</dt>
                  <dd>1</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>685 lbs</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>50&quot; × 40&quot; × 40&quot;</dd>
                </div>
              </dl>
            </div>
            <dl className='rate-items-card__totals'>
              <div>
                <dt>Total weight</dt>
                <dd>685 lbs</dd>
              </div>
              <div>
                <dt>Total linear feet</dt>
                <dd>3 ft</dd>
              </div>
            </dl>
          </article>
        </aside>

        <main className='rate-results'>
          <div className='rate-mode-tabs' role='tablist' aria-label='Quote type'>
            <button
              type='button'
              role='tab'
              aria-selected={quoteMode === "ltl"}
              className={quoteMode === "ltl" ? "active" : ""}
              onClick={() => setQuoteMode("ltl")}>
              LTL <span>11</span>
            </button>
            <button
              type='button'
              role='tab'
              aria-selected={quoteMode === "volume"}
              className={quoteMode === "volume" ? "active" : ""}
              onClick={() => setQuoteMode("volume")}>
              Volume <span>0</span>
            </button>
          </div>

          <div className='rate-toolbar'>
            <Input
              value={search}
              prefix={<SearchOutlined />}
              placeholder='Carriers search'
              allowClear
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select<SortOption>
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "rate-asc", label: "Sort by rate, low to high" },
                { value: "rate-desc", label: "Sort by rate, high to low" },
                { value: "transit", label: "Sort by transit time" },
              ]}
            />
            <Button
              className='rate-send-all'
              icon={<SendOutlined />}
              onClick={() => openSendDialog()}>
              Send All
            </Button>
            <div className='rate-view-switch' aria-label='Results view'>
              <button
                type='button'
                className={viewMode === "list" ? "active" : ""}
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}>
                <BarsOutlined /> List View
              </button>
              <button
                type='button'
                className={viewMode === "grid" ? "active" : ""}
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}>
                <AppstoreOutlined /> Grid View
              </button>
            </div>
          </div>

          <p className='rate-results-count'>
            Showing {quoteMode === "ltl" ? visibleRates.length : 0} of 11
            carriers
          </p>

          {quoteMode === "volume" ? (
            <div className='rate-empty-state'>
              <Empty description='No volume rates are available for this quote.' />
            </div>
          ) : visibleRates.length ? (
            <div className={`rate-carrier-list rate-carrier-list--${viewMode}`}>
              {visibleRates.map((rate) => (
                <CarrierCard
                  key={rate.id}
                  rate={rate}
                  checked={selectedRates.includes(rate.id)}
                  onCheckedChange={(checked) =>
                    setRateChecked(rate, checked)
                  }
                  onSend={() => openSendDialog([rate.id])}
                />
              ))}
            </div>
          ) : (
            <div className='rate-empty-state'>
              <Empty description='No carriers match your search.' />
            </div>
          )}
        </main>
      </div>

      <SendRatesDialog
        open={isSendDialogOpen}
        rates={carrierRates}
        recipients={sendRecipients}
        selectedRateIds={sendRateIds}
        validationError={sendValidationError}
        onClose={closeSendDialog}
        onRecipientsChange={(recipients) => {
          setSendRecipients(recipients);
          setSendValidationError("");
        }}
        onSelectedRateIdsChange={(rateIds) => {
          setSendRateIds(rateIds);
          setSendValidationError("");
        }}
        onSubmit={sendRates}
      />
    </section>
  );
}

export default Rate;
