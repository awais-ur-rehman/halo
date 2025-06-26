import { useEffect, useRef, useState } from "react";
import { Navigation, RefreshCw, AlertCircle } from "lucide-react";
import type { Branch, UserLocation } from "../../hook/useControlCenter";

interface GoogleMapProps {
  userLocation: UserLocation | null;
  branches: Branch[];
  onBranchSelect?: (branch: Branch) => void;
  loading?: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

export const GoogleMap = ({
  userLocation,
  branches,
  onBranchSelect,
  loading,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        initializeMap();
        return;
      }

      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJS.crossOrigin = "";
      leafletJS.onload = () => {
        setTimeout(initializeMap, 100);
      };
      leafletJS.onerror = () => {
        setMapError("Failed to load map library");
      };
      document.head.appendChild(leafletJS);
    };

    if (userLocation) {
      loadLeaflet();
    }
  }, [userLocation]);

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !window.L) return;

    try {
      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([userLocation.lat, userLocation.lng], 12);

      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        window.L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            attribution: "© CartoDB",
          }
        ).addTo(map);
      } else {
        window.L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            attribution: "© CartoDB",
          }
        ).addTo(map);
      }

      window.L.control
        .zoom({
          position: "topright",
        })
        .addTo(map);

      leafletMapRef.current = map;

      const userIcon = window.L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="
            width: 16px; 
            height: 16px; 
            background: linear-gradient(135deg, #3B82F6, #1D4ED8); 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25), 0 2px 8px rgba(59, 130, 246, 0.15);
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      window.L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      }).addTo(map);

      setMapLoaded(true);
      setMapError(null);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
    }
  };

  const createCustomIcon = (type: Branch["type"], status: Branch["status"]) => {
    let icon = "🏦";
    let bgColor = "59, 130, 246"; // blue
    let borderColor = "59, 130, 246";

    if (type === "atm") {
      icon = "🏧";
      bgColor = "16, 185, 129"; // emerald
      borderColor = "16, 185, 129";
    }
    if (type === "main") {
      icon = "🏛️";
      bgColor = "139, 92, 246"; // violet
      borderColor = "139, 92, 246";
    }

    const opacity = status === "active" ? "0.18" : "0.08";
    const borderOpacity = status === "active" ? "0.4" : "0.2";

    return window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 32px; 
          height: 32px; 
          background: rgba(${bgColor}, ${opacity}); 
          border: 1px solid rgba(${borderColor}, ${borderOpacity});
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s ease;
          backdrop-filter: blur(2px);
        ">${icon}</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  useEffect(() => {
    if (!leafletMapRef.current || !mapLoaded || !branches.length) return;

    markersRef.current.forEach((marker) =>
      leafletMapRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    branches.forEach((branch) => {
      const icon = createCustomIcon(branch.type, branch.status);

      const marker = window.L.marker(
        [branch.coordinates.lat, branch.coordinates.lng],
        { icon }
      ).addTo(leafletMapRef.current);

      const popupContent = `
        <div style="font-family: system-ui; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${branch.name}
          </h3>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">
            ${branch.address}
          </p>
          <p style="margin: 0; font-size: 13px; color: #374151;">
            ${branch.workingHours}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelectedBranch(branch);
        onBranchSelect?.(branch);
      });

      markersRef.current.push(marker);
    });
  }, [branches, mapLoaded, onBranchSelect]);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 mb-4 max-w-md">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <Navigation className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Getting your location...
          </h3>
          <p className="text-gray-600">
            Please allow location access to view nearby branches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <style>{`
        .leaflet-container {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .dark .leaflet-container {
          background: linear-gradient(135deg, #0a0a0a 0%, #111827 100%);
        }

        .leaflet-tile-pane {
          filter: contrast(1.05) brightness(0.97) saturate(1.02);
        }

        .dark .leaflet-tile-pane {
          filter: contrast(1.2) brightness(0.85) saturate(0.8) hue-rotate(200deg);
        }

        .leaflet-control-zoom {
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .leaflet-control-zoom {
          background: rgba(17, 24, 39, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(75, 85, 99, 0.2);
        }

        .leaflet-control-zoom a {
          background: transparent;
          color: #4b5563;
          border: none;
          font-weight: 500;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .dark .leaflet-control-zoom a {
          color: #9ca3af;
        }

        .leaflet-control-zoom a:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #1e40af;
        }

        .dark .leaflet-control-zoom a:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 0;
          backdrop-filter: blur(16px);
        }

        .dark .leaflet-popup-content-wrapper {
          background: rgba(17, 24, 39, 0.98);
          border: 1px solid rgba(75, 85, 99, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .leaflet-popup-content {
          margin: 0;
          color: #1f2937;
        }

        .dark .leaflet-popup-content {
          color: #e5e7eb;
        }

        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .dark .leaflet-popup-tip {
          background: rgba(17, 24, 39, 0.98);
          border: 1px solid rgba(75, 85, 99, 0.2);
        }

        .leaflet-popup-close-button {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          font-weight: bold;
          right: 6px;
          top: 6px;
          transition: all 0.2s ease;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .dark .leaflet-popup-close-button {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .leaflet-popup-close-button:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        .dark .leaflet-popup-close-button:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .custom-marker {
          transition: all 0.2s ease;
        }

        .custom-marker:hover {
          transform: scale(1.15);
        }

        .custom-marker:hover > div {
          background: rgba(59, 130, 246, 0.3) !important;
          border-color: rgba(59, 130, 246, 0.6) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
        }

        .user-location-marker {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-[1000]">
          <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200/50">
            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
            <span className="text-gray-700 font-medium">
              Loading branches...
            </span>
          </div>
        </div>
      )}

      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-2 shadow-lg z-[1000]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {branches.length} locations
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
