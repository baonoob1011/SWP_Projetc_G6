import { useEffect, useRef } from 'react';
import './Map.css';

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = 'AIzaSyBj1OypObsb65agJ1tR05X6JA8trtx6_g8';
    document.body.classList.add('map-fullscreen');

    if (document.getElementById('google-maps-script')) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    document.head.appendChild(script);

    function initMap() {
      if (mapRef.current && window.google) {
        const destination = { lat: 10.830037, lng: 106.6159066 }; // PK Tân Bình

        const map = new window.google.maps.Map(mapRef.current, {
          center: destination,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: true,
        });

        const marker = new window.google.maps.Marker({
          position: destination,
          map,
          title: 'PK Tân Bình',
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px;">
              <h3 style="color: red;">Phòng khám Đa khoa Tân Bình</h3>
              <p>123 Đường ABC, Quận Tân Bình, TP.HCM</p>
              <p><strong>Giờ mở cửa:</strong> 8:00 - 17:00</p>
              <p><strong>Điện thoại:</strong> <a href="tel:0123456789">0123 456 789</a></p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Dùng directionsService + directionsRenderer để vẽ đường đi
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        // Lấy vị trí người dùng
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              // Vẽ tuyến đường
              directionsService.route(
                {
                  origin: userLocation,
                  destination: destination,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                  if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                  } else {
                    console.error('Không thể tìm đường đi: ' + status);
                  }
                }
              );
            },
            (error) => {
              console.error('Không lấy được vị trí người dùng:', error);
            }
          );
        } else {
          console.warn('Trình duyệt không hỗ trợ Geolocation');
        }
      }
    }

    return () => {
      const scriptEl = document.getElementById('google-maps-script');
      if (scriptEl) scriptEl.remove();
      document.body.classList.remove('map-fullscreen');
    };
  }, []);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-element" />
    </div>
  );
}
