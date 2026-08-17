import { useGoogleMap } from "@react-google-maps/api";
import { useEffect } from "react";

type AdvancedMapMarkerProps = {
  position: google.maps.LatLngLiteral;
  title: string;
};

/** React lifecycle wrapper for Google's non-deprecated advanced marker. */
function AdvancedMapMarker({ position, title }: AdvancedMapMarkerProps) {
  const map = useGoogleMap();
  const { lat, lng } = position;

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    let cancelled = false;
    let marker: google.maps.marker.AdvancedMarkerElement | null = null;

    const addMarker = async () => {
      const { AdvancedMarkerElement } = (await window.google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      if (cancelled) return;

      marker = new AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title,
      });
    };

    void addMarker().catch((error: unknown) => {
      console.error("Unable to add an advanced map marker.", error);
    });

    return () => {
      cancelled = true;
      if (marker) marker.map = null;
    };
  }, [lat, lng, map, title]);

  return null;
}

export default AdvancedMapMarker;
