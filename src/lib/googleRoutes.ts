export type RouteLocation = {
  address: string;
  position: google.maps.LatLngLiteral;
};

type RouteComputeResponse = {
  routes?: Array<{
    path?: Array<google.maps.LatLng | google.maps.LatLngLiteral>;
    distanceMeters?: number;
    durationMillis?: number;
  }>;
};

type RouteLibrary = {
  Route: {
    computeRoutes: (request: {
      origin: string | google.maps.LatLngLiteral;
      destination: string | google.maps.LatLngLiteral;
      travelMode: "DRIVING";
      fields: string[];
    }) => Promise<RouteComputeResponse>;
  };
};

export type ComputedRoute = {
  path: google.maps.LatLngLiteral[];
  distanceMeters?: number;
  durationMillis?: number;
};

function toWaypoint(value: RouteLocation | string) {
  return typeof value === "string" ? value : value.position;
}

function toLatLngLiteral(
  point: google.maps.LatLng | google.maps.LatLngLiteral,
): google.maps.LatLngLiteral {
  const maybeLatLng = point as google.maps.LatLng;

  if (typeof maybeLatLng.lat === "function") {
    return maybeLatLng.toJSON();
  }

  return point as google.maps.LatLngLiteral;
}

/** Calls the current Routes Library API and returns map-ready route data. */
export async function computeDrivingRoute(
  origin: RouteLocation | string,
  destination: RouteLocation | string,
): Promise<ComputedRoute> {
  const { Route } = (await window.google.maps.importLibrary(
    "routes",
  )) as unknown as RouteLibrary;
  const response = await Route.computeRoutes({
    origin: toWaypoint(origin),
    destination: toWaypoint(destination),
    travelMode: "DRIVING",
    fields: ["path", "distanceMeters", "durationMillis"],
  });
  const route = response.routes?.[0];

  if (!route?.path?.length) {
    throw new Error("No driving route was returned.");
  }

  return {
    path: route.path.map(toLatLngLiteral),
    distanceMeters: route.distanceMeters,
    durationMillis: route.durationMillis,
  };
}

export function formatRouteDistance(distanceMeters?: number) {
  if (typeof distanceMeters !== "number") return "Distance unavailable";
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function formatRouteDuration(durationMillis?: number) {
  if (typeof durationMillis !== "number") return "Duration unavailable";
  return `${Math.max(1, Math.round(durationMillis / 60000))} min`;
}
