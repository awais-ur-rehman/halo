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

      // Enhanced user location marker with animated glow
      const userIcon = window.L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="
            position: relative;
            width: 20px; 
            height: 20px;
          ">
            <div style="
              position: absolute;
              width: 20px; 
              height: 20px; 
              background: linear-gradient(135deg, #FF6B6B, #FF8E53, #FF6B9D); 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 
                0 0 0 6px rgba(255, 107, 107, 0.2),
                0 0 0 12px rgba(255, 107, 107, 0.1),
                0 4px 12px rgba(255, 107, 107, 0.3);
              animation: userPulse 2s ease-in-out infinite;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
              box-shadow: 0 0 4px rgba(0,0,0,0.2);
            "></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
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
    let gradientColors = ["#6366F1", "#8B5CF6"]; // indigo to purple
    let shadowColor = "99, 102, 241";

    if (type === "atm") {
      icon = "🏧";
      gradientColors = ["#10B981", "#06D6A0"]; // emerald to teal
      shadowColor = "16, 185, 129";
    }
    if (type === "main") {
      icon = "🏛️";
      gradientColors = ["#8B5CF6", "#EC4899"]; // violet to pink
      shadowColor = "139, 92, 246";
    }

    const isActive = status === "active";
    const opacity = isActive ? "0.95" : "0.6";
    const size = isActive ? "36px" : "32px";
    const shadowIntensity = isActive ? "0.4" : "0.2";

    return window.L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: ${size}; 
          height: ${size}; 
          background: linear-gradient(135deg, ${gradientColors[0]}, ${
        gradientColors[1]
      }); 
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isActive ? "16px" : "14px"};
          opacity: ${opacity};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(2px);
          box-shadow: 
            0 0 0 4px rgba(${shadowColor}, 0.2),
            0 4px 12px rgba(${shadowColor}, ${shadowIntensity}),
            0 2px 6px rgba(0, 0, 0, 0.1);
          ${isActive ? "animation: markerGlow 3s ease-in-out infinite;" : ""}
        ">${icon}</div>
      `,
      iconSize: [parseInt(size), parseInt(size)],
      iconAnchor: [parseInt(size) / 2, parseInt(size) / 2],
      popupAnchor: [0, -parseInt(size) / 2],
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

      // Enhanced popup with colorful styling
      const statusColor = branch.status === "active" ? "#10B981" : "#F59E0B";
      const typeColor =
        branch.type === "main"
          ? "#8B5CF6"
          : branch.type === "atm"
          ? "#06D6A0"
          : "#6366F1";

      const popupContent = `
        <div style="font-family: system-ui; padding: 12px; background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="
              width: 8px; 
              height: 8px; 
              background: ${typeColor}; 
              border-radius: 50%; 
              margin-right: 8px;
              box-shadow: 0 0 8px ${typeColor}50;
            "></div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937; background: linear-gradient(135deg, #1f2937, #374151); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${branch.name}
            </h3>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
            📍 ${branch.address}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151; line-height: 1.4;">
            🕒 ${branch.workingHours}
          </p>
          <div style="display: flex; align-items: center;">
            <div style="
              padding: 2px 8px; 
              background: linear-gradient(135deg, ${statusColor}20, ${statusColor}10); 
              border: 1px solid ${statusColor}40; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: 500; 
              color: ${statusColor}; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ${branch.status}
            </div>
            <div style="
              margin-left: 8px;
              padding: 2px 8px; 
              background: linear-gradient(135deg, ${typeColor}20, ${typeColor}10); 
              border: 1px solid ${typeColor}40; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: 500; 
              color: ${typeColor}; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">
              ${branch.type}
            </div>
          </div>
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="relative">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 bg-red-500 rounded-full opacity-20 animate-ping mx-auto"></div>
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Map Error
          </h3>
          <p className="text-red-700 mb-4 max-w-md">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
        <div className="text-center">
          <div className="relative">
            <Navigation className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse mx-auto"></div>
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🌍 Getting your location...
          </h3>
          <p className="text-gray-600">
            📍 Please allow location access to view nearby branches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <style>{`
        .leaflet-container {
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f3e5f5 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .dark .leaflet-container {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }

        .leaflet-tile-pane {
          filter: contrast(1.1) brightness(0.95) saturate(1.1) hue-rotate(5deg);
        }

        .dark .leaflet-tile-pane {
          filter: contrast(1.3) brightness(0.8) saturate(0.9) hue-rotate(200deg);
        }

        .leaflet-control-zoom {
          border: none;
          box-shadow: 
            0 8px 32px rgba(59, 130, 246, 0.15), 
            0 4px 16px rgba(139, 92, 246, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
          backdrop-filter: blur(16px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .dark .leaflet-control-zoom {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4), 
            0 4px 16px rgba(59, 130, 246, 0.2),
            0 1px 3px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(75, 85, 99, 0.3);
        }

        .leaflet-control-zoom a {
          background: transparent;
          color: #4b5563;
          border: none;
          font-weight: 600;
          width: 34px;
          height: 34px;
          line-height: 34px;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark .leaflet-control-zoom a {
          color: #9ca3af;
        }

        .leaflet-control-zoom a:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
          color: #1e40af;
          transform: scale(1.05);
        }

        .dark .leaflet-control-zoom a:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
          color: #93c5fd;
        }

        .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
          border-radius: 16px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15), 
            0 8px 16px rgba(59, 130, 246, 0.1),
            0 4px 8px rgba(139, 92, 246, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0;
          backdrop-filter: blur(20px);
        }

        .dark .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%);
          border: 2px solid rgba(75, 85, 99, 0.3);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.6), 
            0 8px 16px rgba(59, 130, 246, 0.2),
            0 4px 8px rgba(139, 92, 246, 0.1);
        }

        .leaflet-popup-content {
          margin: 0;
          color: #1f2937;
        }

        .dark .leaflet-popup-content {
          color: #e5e7eb;
        }

        .leaflet-popup-tip {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .dark .leaflet-popup-tip {
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%);
          border: 2px solid rgba(75, 85, 99, 0.3);
        }

        .leaflet-popup-close-button {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(236, 72, 153, 0.15));
          color: #dc2626;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 14px;
          font-weight: bold;
          right: 8px;
          top: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(239, 68, 68, 0.3);
        }

        .dark .leaflet-popup-close-button {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(236, 72, 153, 0.2));
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .leaflet-popup-close-button:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(236, 72, 153, 0.3));
          transform: scale(1.1) rotate(90deg);
        }

        .dark .leaflet-popup-close-button:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(236, 72, 153, 0.4));
        }

        .custom-marker {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-marker:hover {
          transform: scale(1.2) rotate(5deg);
        }

        .custom-marker:hover > div {
          box-shadow: 
            0 0 0 6px rgba(59, 130, 246, 0.3) !important,
            0 8px 24px rgba(59, 130, 246, 0.4) !important,
            0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }

        .user-location-marker {
          z-index: 1000;
        }

        @keyframes userPulse {
          0%, 100% {
            box-shadow: 
              0 0 0 6px rgba(255, 107, 107, 0.2),
              0 0 0 12px rgba(255, 107, 107, 0.1),
              0 4px 12px rgba(255, 107, 107, 0.3);
          }
          50% {
            box-shadow: 
              0 0 0 10px rgba(255, 107, 107, 0.3),
              0 0 0 20px rgba(255, 107, 107, 0.15),
              0 8px 20px rgba(255, 107, 107, 0.4);
          }
        }

        @keyframes markerGlow {
          0%, 100% {
            filter: brightness(1) saturate(1);
          }
          50% {
            filter: brightness(1.2) saturate(1.3);
          }
        }

        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/90 to-purple-50/90 backdrop-blur-sm flex items-center justify-center rounded-lg z-[1000]">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-white/50">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-gray-700 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Loading branches...
            </span>
          </div>
        </div>
      )}

      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 dark:from-gray-900/95 dark:via-blue-900/95 dark:to-purple-900/95 backdrop-blur-sm border-2 border-white/50 dark:border-gray-700/50 rounded-2xl px-4 py-3 shadow-2xl z-[1000] animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-ping opacity-50"></div>
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎯 {branches.length} locations found
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
