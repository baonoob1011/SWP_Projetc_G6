import { useEffect, useRef } from "react";
import "./Map.css"

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = "AIzaSyBj1OypObsb65agJ1tR05X6JA8trtx6_g8";

    // Thêm class cho body để làm fullscreen
    document.body.classList.add('map-fullscreen');

    // Kiểm tra nếu đã load rồi thì không load lại
    if (document.getElementById("google-maps-script")) {
      initMap();
      return;
    }

    // Tạo script Google Maps API và load
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      initMap();
    };

    document.head.appendChild(script);

    // Hàm init map sau khi script load xong
    function initMap() {
      if (mapRef.current && window.google) {
        const defaultLocation = { lat: 10.830037, lng: 106.6159066 };
        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 14,
        });
        new window.google.maps.Marker({
          position: defaultLocation,
          map,
          title: "PK Tân Bình",
        });
      }
    }

    // Cleanup: Xóa script và class khi component unmount
    return () => {
      const scriptEl = document.getElementById("google-maps-script");
      if (scriptEl) {
        scriptEl.remove();
      }
      // Xóa class fullscreen khi component bị unmount
      document.body.classList.remove('map-fullscreen');
    };
  }, []);

  return (
    <div className="map-container">
      <div
        ref={mapRef}
        className="map-element"
      />
    </div>
  );
}