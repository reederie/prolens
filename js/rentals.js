// rentals.js - Rental management functions

// Use a module-specific base constant to avoid global name conflicts
const RENTALS_API_BASE = 'https://prolens.ccs4thyear.com/api';

// Load all rentals (Admin)
async function loadAllRentals() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: `${RENTALS_API_BASE}/rentals`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error loading rentals:', err);
    throw err;
  }
}

// Load employee rentals
async function loadEmployeeRentals() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: `${RENTALS_API_BASE}/employee/rentals`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error loading employee rentals:', err);
    throw err;
  }
}

// Load renter rentals
async function loadMyRentals() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: `${RENTALS_API_BASE}/my-rentals`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error loading my rentals:', err);
    throw err;
  }
}

// Create a rental (Renter)
async function createRental(rentalData) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals`,
      data: rentalData
    });
    
    return response.data;
  } catch (err) {
    console.error('Error creating rental:', err);
    throw err;
  }
}

// Approve rental (Employee)
async function approveRental(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/approve`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error approving rental:', err);
    throw err;
  }
}

// Decline rental (Employee)
async function declineRental(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/decline`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error declining rental:', err);
    throw err;
  }
}

// Extend rental (Renter)
async function extendRental(id, additionalDays) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/extend`,
      data: { additional_days: additionalDays }
    });
    
    return response.data;
  } catch (err) {
    console.error('Error extending rental:', err);
    throw err;
  }
}

// Cancel rental (Renter)
async function cancelRental(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/cancel`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error cancelling rental:', err);
    throw err;
  }
}

// Handle camera (Employee) - Mark approved as active
async function handleCamera(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/handle-camera`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error handling camera:', err);
    throw err;
  }
}

// Return camera (Employee) - Mark active as returned
async function returnCamera(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/return`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error returning camera:', err);
    throw err;
  }
}

// Complete rental (Employee) - Mark returned as completed
async function completeRental(id) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${RENTALS_API_BASE}/rentals/${id}/complete`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error completing rental:', err);
    throw err;
  }
}


