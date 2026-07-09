import React, { createContext, useState, useEffect } from 'react';
import { brands as brandsApi } from './api';

export const BrandContext = createContext();

export function BrandProvider({ children }) {
  const [brandList, setBrandList] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize: fetch brands and restore selectedBrandId from localStorage
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandsApi.list();
        setBrandList(res.data);

        // Restore selectedBrandId from localStorage, or fall back to first brand
        const stored = localStorage.getItem('selectedBrandId');
        if (stored && res.data.some(b => b.id === stored)) {
          setSelectedBrandId(stored);
        } else if (res.data.length > 0) {
          setSelectedBrandId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Persist selectedBrandId to localStorage whenever it changes
  useEffect(() => {
    if (selectedBrandId) {
      localStorage.setItem('selectedBrandId', selectedBrandId);
    }
  }, [selectedBrandId]);

  const refreshBrands = async () => {
    try {
      const res = await brandsApi.list();
      setBrandList(res.data);
      
      // If current selection no longer exists, fall back to first brand
      if (!res.data.some(b => b.id === selectedBrandId) && res.data.length > 0) {
        setSelectedBrandId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to refresh brands:', err);
    }
  };

  const handleSetSelectedBrandId = (brandId) => {
    if (brandList.some(b => b.id === brandId)) {
      setSelectedBrandId(brandId);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brandList,
        selectedBrandId,
        setSelectedBrandId: handleSetSelectedBrandId,
        refreshBrands,
        loading
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = React.useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
}
