// auth.js - jQuery version

function requireAuth() {
  const token = localStorage.getItem('authToken');
  if (!token || typeof token !== 'string' || token.length < 10) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Your session has expired or is invalid. Please log in again.',
      confirmButtonText: 'Go to Login',
      allowOutsideClick: false
    }).then(() => {
      window.location.href = 'login.html';
    });
  }
}

function redirectIfLoggedIn() {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (token) {
    goToDashboardForRole(role);
  }
}

// Central helper: send user to the correct dashboard based on role
function goToDashboardForRole(role) {
  // Single unified dashboard; role-specific content handled inside dashboard.html
  window.location.href = 'dashboard.html';
}

/**
 * Comprehensive Error Handler
 * Formats errors in a copyable format for debugging
 */
function formatErrorForAlert(error, context = '') {
  let errorDetails = [];
  
  // Add context if provided
  if (context) {
    errorDetails.push(`=== ${context} ===`);
  }
  
  // Add timestamp
  errorDetails.push(`Time: ${new Date().toISOString()}`);
  
  // Request information
  if (error.config) {
    errorDetails.push(`\n--- Request ---`);
    errorDetails.push(`URL: ${error.config.url || 'N/A'}`);
    errorDetails.push(`Method: ${error.config.method?.toUpperCase() || 'N/A'}`);
    if (error.config.data) {
      errorDetails.push(`Data: ${JSON.stringify(error.config.data, null, 2)}`);
    }
  }
  
  // Response information
  if (error.response) {
    errorDetails.push(`\n--- Response ---`);
    errorDetails.push(`Status: ${error.response.status} ${error.response.statusText || ''}`);
    errorDetails.push(`URL: ${error.response.config?.url || 'N/A'}`);
    
    if (error.response.data) {
      errorDetails.push(`\nResponse Data:`);
      errorDetails.push(JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response.headers) {
      errorDetails.push(`\nResponse Headers:`);
      errorDetails.push(JSON.stringify(error.response.headers, null, 2));
    }
  } else if (error.request) {
    errorDetails.push(`\n--- Network Error ---`);
    errorDetails.push(`No response received from server`);
    errorDetails.push(`Request: ${JSON.stringify(error.request, null, 2)}`);
  } else {
    errorDetails.push(`\n--- Error ---`);
    errorDetails.push(`Message: ${error.message || 'Unknown error'}`);
  }
  
  // Error message
  if (error.message) {
    errorDetails.push(`\n--- Error Message ---`);
    errorDetails.push(error.message);
  }
  
  // Stack trace (if available)
  if (error.stack) {
    errorDetails.push(`\n--- Stack Trace ---`);
    errorDetails.push(error.stack);
  }
  
  // Full error object (for debugging)
  errorDetails.push(`\n--- Full Error Object (JSON) ---`);
  try {
    errorDetails.push(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  } catch (e) {
    errorDetails.push('Could not stringify error object');
  }
  
  return errorDetails.join('\n');
}

/**
 * Show error in SweetAlert with copyable format
 */
async function showErrorAlert(error, context = '') {
  const errorText = formatErrorForAlert(error, context);
  
  // Create a more user-friendly message first
  let userMessage = '';
  if (error.response) {
    if (error.response.data?.message) {
      userMessage = error.response.data.message;
    } else if (error.response.data?.errors) {
      const errors = error.response.data.errors;
      userMessage = 'Validation errors:\n';
      for (const field in errors) {
        userMessage += `${field}: ${Array.isArray(errors[field]) ? errors[field].join(', ') : errors[field]}\n`;
      }
    } else {
      userMessage = `Error ${error.response.status}: ${error.response.statusText || 'Request failed'}`;
    }
  } else if (error.message) {
    userMessage = error.message;
  } else {
    userMessage = 'An unexpected error occurred';
  }
  
  // Show user-friendly message first
  const result = await Swal.fire({
    icon: 'error',
    title: context || 'Error',
    text: userMessage,
    confirmButtonText: 'View Details',
    showCancelButton: true,
    cancelButtonText: 'Dismiss',
    footer: '<small>Click "View Details" to see full error information</small>'
  });
  
  if (result.isConfirmed) {
    // Show detailed error in a modal with copy button
    await Swal.fire({
      icon: 'info',
      title: 'Error Details',
      html: `<pre style="text-align: left; max-height: 400px; overflow-y: auto; background: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 12px;">${escapeHtml(errorText)}</pre>`,
      width: '80%',
      confirmButtonText: 'Copy to Clipboard',
      showCancelButton: true,
      cancelButtonText: 'Close',
      didOpen: () => {
        // Auto-select text for easy copying
        const $pre = $(Swal.getHtmlContainer()).find('pre');
        if ($pre.length) {
          const range = document.createRange();
          range.selectNodeContents($pre[0]);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }).then((copyResult) => {
      if (copyResult.isConfirmed) {
        // Copy to clipboard
        navigator.clipboard.writeText(errorText).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Error details have been copied to clipboard',
            timer: 2000,
            showConfirmButton: false
          });
        }).catch(() => {
          // Fallback for older browsers
          const $textarea = $('<textarea>')
            .val(errorText)
            .css({ position: 'fixed', left: '-9999px' })
            .appendTo('body');
          $textarea[0].select();
          try {
            document.execCommand('copy');
            Swal.fire({
              icon: 'success',
              title: 'Copied!',
              text: 'Error details have been copied to clipboard',
              timer: 2000,
              showConfirmButton: false
            });
          } catch (err) {
            Swal.fire({
              icon: 'warning',
              title: 'Copy Failed',
              text: 'Please manually copy the error details',
              timer: 3000
            });
          }
          $textarea.remove();
        });
      }
    });
  }
  
  // Also log to console
  console.error('=== ERROR DETAILS ===', error);
  console.error('=== FORMATTED ERROR ===', errorText);
}

// Helper function to escape HTML
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

// A helper function to wrap jQuery AJAX calls and handle 401 Unauthorized
async function authAxios(config = {}) {
  const token = localStorage.getItem('authToken');
  config.headers = config.headers || {};
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Convert axios-style config to jQuery ajax config
    const ajaxConfig = {
      url: config.url,
      method: config.method || 'GET',
      headers: config.headers,
      contentType: config.headers['Content-Type'] || 'application/json',
      dataType: 'json'
    };

    // Handle data based on content type
    if (config.data) {
      if (config.data instanceof FormData) {
        ajaxConfig.data = config.data;
        ajaxConfig.processData = false;
        ajaxConfig.contentType = false;
      } else if (typeof config.data === 'object') {
        ajaxConfig.data = JSON.stringify(config.data);
      } else {
        ajaxConfig.data = config.data;
      }
    }

    const response = await $.ajax(ajaxConfig);
    return { data: response };
  } catch (jqXHR) {
    // Convert jQuery error to axios-like error format for compatibility
    const error = new Error(jqXHR.statusText || 'Request failed');
    error.response = {
      status: jqXHR.status,
      statusText: jqXHR.statusText,
      data: jqXHR.responseJSON || jqXHR.responseText,
      config: { url: config.url }
    };
    error.config = config;
    
    if (jqXHR.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userInfo');
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        confirmButtonText: 'Go to Login',
        allowOutsideClick: false
      }).then(() => {
        window.location.href = 'login.html';
      });
      return null; // Stop further processing
    }
    
    // Show detailed error for debugging
    const context = `${config.method?.toUpperCase() || 'REQUEST'} ${config.url || 'Unknown URL'}`;
    showErrorAlert(error, context);
    
    throw error; // Re-throw other errors
  }
}

/**
 * Refresh user role from server and update localStorage
 * Returns the new role or null if failed
 */
async function refreshUserRole() {
  try {
    const response = await authAxios({
      method: 'GET',
      url: 'https://prolens.ccs4thyear.com/api/profile'
    });
    
    if (response && response.data && response.data.role) {
      const newRole = response.data.role;
      const oldRole = localStorage.getItem('userRole');
      
      // Update localStorage
      localStorage.setItem('userRole', newRole);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      // If role changed, notify and handle the change
      if (oldRole && oldRole !== newRole) {
        handleRoleChange(oldRole, newRole);
      }
      
      return newRole;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing user role:', error);
    return null;
  }
}

/**
 * Handle role change - update UI and redirect if needed
 */
function handleRoleChange(oldRole, newRole) {
  console.log(`Role changed from ${oldRole} to ${newRole}`);
  
  // Trigger localStorage event for other tabs/windows
  localStorage.setItem('roleChanged', JSON.stringify({
    oldRole: oldRole,
    newRole: newRole,
    timestamp: Date.now()
  }));
  localStorage.removeItem('roleChanged'); // Remove immediately after setting
  
  // Show notification
  Swal.fire({
    icon: 'success',
    title: 'Role Changed',
    html: `Your role has been changed from <strong>${oldRole}</strong> to <strong>${newRole}</strong>.<br>The page will refresh to apply the changes.`,
    confirmButtonText: 'OK',
    allowOutsideClick: false
  }).then(() => {
    // Redirect to dashboard to apply new role
    window.location.href = 'dashboard.html';
  });
}

/**
 * Check for role changes (called on page load and periodically)
 */
async function checkRoleChange() {
  const currentRole = localStorage.getItem('userRole');
  if (!currentRole) return;
  
  const newRole = await refreshUserRole();
  // handleRoleChange is called inside refreshUserRole if role changed
}

/**
 * Initialize role change detection
 * - Check on page load
 * - Listen for localStorage events (from other tabs)
 * - Periodically check for changes
 */
function initRoleChangeDetection() {
  // Check on page load
  checkRoleChange();
  
  // Listen for role changes from other tabs/windows
  $(window).on('storage', function(e) {
    if (e.originalEvent.key === 'roleChanged' && e.originalEvent.newValue) {
      try {
        const changeData = JSON.parse(e.originalEvent.newValue);
        const currentRole = localStorage.getItem('userRole');
        if (changeData.newRole && currentRole !== changeData.newRole) {
          // Role was changed in another tab
          localStorage.setItem('userRole', changeData.newRole);
          handleRoleChange(currentRole, changeData.newRole);
        }
      } catch (err) {
        console.error('Error parsing role change data:', err);
      }
    }
  });
  
  // Periodically check for role changes (every 30 seconds)
  setInterval(() => {
    checkRoleChange();
  }, 30000);
}

// Auto-initialize role change detection when auth.js loads
if (typeof window !== 'undefined') {
  // Only initialize if user is logged in
  const token = localStorage.getItem('authToken');
  if (token) {
    // Wait for DOM to be ready using jQuery
    $(function() {
      initRoleChangeDetection();
    });
  }
}
