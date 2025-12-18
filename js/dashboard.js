// dashboard.js - Dashboard statistics

const DASHBOARD_API_BASE = 'https://prolens.ccs4thyear.com/api';

// Load dashboard stats
async function loadDashboardStats() {
  try {
    const role = localStorage.getItem('userRole');
    const response = await authAxios({
      method: 'GET',
      url: `${DASHBOARD_API_BASE}/dashboard`
    });
    
    if (response && response.data) {
      return response.data;
    }
    
    throw new Error('Invalid response from dashboard API');
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    throw err;
  }
}

