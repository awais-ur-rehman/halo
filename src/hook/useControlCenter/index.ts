// src/hooks/useBranches/index.ts
import { useState, useEffect } from 'react';

export interface Branch {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'main' | 'branch' | 'atm';
  status: 'active' | 'maintenance' | 'closed';
  phone?: string;
  workingHours?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

// Mock branches data - simulating API response around Karachi, Pakistan
const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'UBL Main Branch Karachi',
    address: 'I.I. Chundrigar Road, Karachi',
    coordinates: { lat: 24.8607, lng: 67.0011 },
    type: 'main',
    status: 'active',
    phone: '+92-21-32456789',
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '2',
    name: 'UBL Clifton Branch',
    address: 'Clifton Block 4, Karachi',
    coordinates: { lat: 24.8138, lng: 67.0299 },
    type: 'branch',
    status: 'active',
    phone: '+92-21-35456789',
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '3',
    name: 'UBL Gulshan Branch',
    address: 'Gulshan-e-Iqbal, Karachi',
    coordinates: { lat: 24.9207, lng: 67.0682 },
    type: 'branch',
    status: 'active',
    phone: '+92-21-34456789',
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '4',
    name: 'UBL Defence Branch',
    address: 'Defence Phase 2, Karachi',
    coordinates: { lat: 24.8059, lng: 67.0756 },
    type: 'branch',
    status: 'active',
    phone: '+92-21-35556789',
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '5',
    name: 'UBL North Nazimabad ATM',
    address: 'North Nazimabad Block B, Karachi',
    coordinates: { lat: 24.9341, lng: 67.0437 },
    type: 'atm',
    status: 'active',
    workingHours: '24/7'
  },
  {
    id: '6',
    name: 'UBL Saddar Branch',
    address: 'M.A. Jinnah Road, Saddar, Karachi',
    coordinates: { lat: 24.8546, lng: 67.0096 },
    type: 'branch',
    status: 'maintenance',
    phone: '+92-21-32556789',
    workingHours: 'Temporarily Closed'
  },
  {
    id: '7',
    name: 'UBL Korangi Branch',
    address: 'Korangi Industrial Area, Karachi',
    coordinates: { lat: 24.8567, lng: 67.1167 },
    type: 'branch',
    status: 'active',
    phone: '+92-21-35156789',
    workingHours: '9:00 AM - 5:00 PM'
  },
  {
    id: '8',
    name: 'UBL Malir ATM',
    address: 'Malir Cantt, Karachi',
    coordinates: { lat: 24.9431, lng: 67.2092 },
    type: 'atm',
    status: 'active',
    workingHours: '24/7'
  }
];

const simulateApiCall = (userLocation?: UserLocation): Promise<Branch[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // If user location is available, you could filter branches by distance here
      // For now, we'll return all mock branches
      resolve(mockBranches);
    }, 1000); // Simulate network delay
  });
};

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationPermissionDenied(false);
      },
      (error) => {
        console.warn('Error getting user location:', error);
        setLocationPermissionDenied(true);
        // Fallback to Karachi center if location access is denied
        setUserLocation({ lat: 24.8607, lng: 67.0011 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  };

  // Fetch branches from API
  const fetchBranches = async (location?: UserLocation) => {
    try {
      setLoading(true);
      setError(null);
      const branchesData = await simulateApiCall(location);
      setBranches(branchesData);
    } catch (err) {
      setError('Failed to fetch branches');
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh branches data
  const refreshBranches = () => {
    fetchBranches(userLocation || undefined);
  };

  // Calculate distance between two points (in kilometers)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Get branches sorted by distance from user
  const getBranchesByDistance = () => {
    if (!userLocation) return branches;

    return [...branches].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distanceB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distanceA - distanceB;
    });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchBranches(userLocation);
    }
  }, [userLocation]);

  return {
    branches,
    userLocation,
    loading,
    error,
    locationPermissionDenied,
    refreshBranches,
    getBranchesByDistance,
    calculateDistance
  };
};