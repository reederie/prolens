// cameras.js - Camera management functions

const API_BASE = 'https://prolens.ccs4thyear.com/api';

// Load all cameras
async function loadCameras() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: `${API_BASE}/cameras`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error loading cameras:', err);
    throw err;
  }
}

// Add a new camera
async function addCamera(cameraData) {
  try {
    const formData = new FormData();
    formData.append('brand', cameraData.brand);
    formData.append('model', cameraData.model);
    formData.append('rental_price', cameraData.rental_price);
    if (cameraData.image) {
      formData.append('image', cameraData.image);
    }

    const response = await authAxios({
      method: 'POST',
      url: `${API_BASE}/cameras`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (err) {
    console.error('Error adding camera:', err);
    throw err;
  }
}

// Update a camera
async function updateCamera(id, cameraData) {
  try {
    const formData = new FormData();
    formData.append('brand', cameraData.brand);
    formData.append('model', cameraData.model);
    formData.append('rental_price', cameraData.rental_price);
    if (cameraData.image) {
      formData.append('image', cameraData.image);
    }

    const response = await authAxios({
      method: 'POST',
      url: `${API_BASE}/cameras/${id}/update`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (err) {
    console.error('Error updating camera:', err);
    throw err;
  }
}

// Delete a camera
async function deleteCamera(id) {
  try {
    const response = await authAxios({
      method: 'DELETE',
      url: `${API_BASE}/cameras/${id}`
    });
    
    return response.data;
  } catch (err) {
    console.error('Error deleting camera:', err);
    throw err;
  }
}

