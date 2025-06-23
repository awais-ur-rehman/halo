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
  rating?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

interface BranchApiData {
  place_id: string;
  title: string;
  types: string;
  address: string;
  gps_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
}

const transformBranchData = (apiData: BranchApiData[]): Branch[] => {
  return apiData.map((branch) => {
    let type: 'main' | 'branch' | 'atm' = 'branch';
    let status: 'active' | 'maintenance' | 'closed' = 'active';
    
    if (branch.title.toLowerCase().includes('head office') || 
        branch.title.toLowerCase().includes('main')) {
      type = 'main';
    } else if (branch.title.toLowerCase().includes('atm') || 
               branch.types.toLowerCase().includes('atm')) {
      type = 'atm';
    }
    
    if (branch.rating && branch.rating < 2) {
      status = 'maintenance';
    } else if (branch.rating === null) {
      status = 'closed';
    }

    let workingHours = '9:00 AM - 5:00 PM';
    if (type === 'atm') {
      workingHours = '24/7';
    }

    return {
      id: branch.place_id,
      name: branch.title,
      address: branch.address,
      coordinates: {
        lat: branch.gps_coordinates.latitude,
        lng: branch.gps_coordinates.longitude
      },
      type,
      status,
      workingHours,
      rating: branch.rating
    };
  });
};

const loadBranchesFromFile = async (): Promise<Branch[]> => {
  try {
    const branchesModule = await import('../../data/branches.json');
    const parsedData = branchesModule.default;
    return transformBranchData(parsedData.data);
  } catch (error) {
    console.error('Error loading branches from file:', error);
    throw new Error('Failed to load branches data');
  }
};

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setUserLocation({ lat: 24.8607, lng: 67.0011 });
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
        setUserLocation({ lat: 24.8607, lng: 67.0011 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const branchesData = await loadBranchesFromFile();
      setBranches(branchesData);
    } catch (err) {
      setError('Failed to fetch branches');
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshBranches = () => {
    fetchBranches();
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
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
    return Math.round(distance * 10) / 10;
  };

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
    fetchBranches();
  }, []);

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