import React, { useEffect, useRef } from 'react';

interface PharmacyMapProps {
  userLat: number;
  userLng: number;
  pharmacies: any[];
  onPharmacyClick?: (pharmacy: any) => void;
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({ userLat, userLng, pharmacies, onPharmacyClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Determine if night mode should be active (after 21h or before 8h)
    const hour = new Date().getHours();
    const isNight = hour >= 21 || hour < 8;

    const nightStyle = [
      { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
      { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
      { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
      { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
      { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
      { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
      { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
      { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
      { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
      { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
      { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
      { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
    ];

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: userLat, lng: userLng },
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: isNight ? nightStyle : [],
    });

    googleMapRef.current = map;

    // User marker
    new google.maps.Marker({
      position: { lat: userLat, lng: userLng },
      map,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      },
      title: "Vous êtes ici"
    });

    return () => {
      // Cleanup markers if needed
    };
  }, [userLat, userLng]);

  useEffect(() => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add pharmacy markers
    pharmacies.forEach(pharmacy => {
      const marker = new google.maps.Marker({
        position: { lat: pharmacy.lat, lng: pharmacy.lng },
        map: googleMapRef.current,
        title: pharmacy.name,
        animation: google.maps.Animation.DROP,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });

      marker.addListener('click', () => {
        if (onPharmacyClick) onPharmacyClick(pharmacy);
      });

      markersRef.current.push(marker);
    });
  }, [pharmacies]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-gray-100" />
  );
};
