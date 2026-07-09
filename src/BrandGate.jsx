import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useBrand } from './BrandContext';

export function BrandGate({ children }) {
  const { brandList, loading } = useBrand();
  const location = useLocation();

  // Show loading state while fetching brands
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user has at least one completed brand (onboarding_complete = 1)
  const hasCompletedBrand = brandList.some(b => b.onboarding_complete === 1);

  // If user has no completed brands and is not already on onboarding, redirect to onboarding
  if (!hasCompletedBrand && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  return children;
}
