// users.js - User management functions (Admin only)

const API_BASE = 'https://prolens.ccs4thyear.com/api';

// Load all users
async function loadUsers() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: `${API_BASE}/users`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error loading users:', err);
    throw err;
  }
}

// Add a new user
async function addUser(userData) {
  try {
    const response = await authAxios({
      method: 'POST',
      url: `${API_BASE}/users`,
      data: userData
    });
    
    return response.data;
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
}

// Update a user
async function updateUser(id, userData) {
  try {
    const response = await authAxios({
      method: 'PUT',
      url: `${API_BASE}/users/${id}`,
      data: userData
    });
    
    return response.data;
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
}

// Delete a user
async function deleteUser(id) {
  try {
    const response = await authAxios({
      method: 'DELETE',
      url: `${API_BASE}/users/${id}`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error deleting user:', err);
    throw err;
  }
}

