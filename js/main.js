// main.js - jQuery version

$(function() {
  const $registerForm = $('#registerForm');

  if ($registerForm.length) {
    $registerForm.on('submit', async function(e) {
      e.preventDefault();

      const $submitButton = $registerForm.find('button[type="submit"]');
      const originalText = $submitButton.text();
      
      $submitButton.prop('disabled', true).text('Registering...');

      const formData = new FormData(this);
      const data = {
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
      };

      try {
        await $.ajax({
          url: 'https://prolens.ccs4thyear.com/api/register',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          timeout: 30000
        });

        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please check your email to verify your account.',
          confirmButtonText: 'Go to Login'
        });
        $registerForm[0].reset();
        window.location.href = "login.html";
      } catch (err) {
        console.error("Registration error:", err);
        // Convert jQuery error to axios-like format for showErrorAlert
        const error = new Error(err.statusText || 'Request failed');
        error.response = {
          status: err.status,
          statusText: err.statusText,
          data: err.responseJSON || err.responseText
        };
        showErrorAlert(error, 'Registration');
      } finally {
        $submitButton.prop('disabled', false).text(originalText);
      }
    });
  }
});

// Logout Handler
$(function() {
  const $logoutBtn = $('#logoutBtn');

  if ($logoutBtn.length) {
    $logoutBtn.on('click', async function(e) {
      e.preventDefault();
      await logout();
    });
  }
});

async function logout() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    Swal.fire({
      icon: 'info',
      title: 'Not Logged In',
      text: 'Please log in to continue.',
      confirmButtonText: 'Go to Login'
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  try {
    const response = await $.ajax({
      url: 'https://prolens.ccs4thyear.com/api/logout',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      contentType: 'application/json'
    });
    
    console.log("Logout response:", response);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    await Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully!',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true
    });
    window.location.href = "login.html";

  } catch (err) {
    console.error("Network error during logout:", err);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    
    // Convert jQuery error to axios-like format for showErrorAlert
    const error = new Error(err.statusText || 'Request failed');
    error.response = {
      status: err.status,
      statusText: err.statusText,
      data: err.responseJSON || err.responseText
    };
    showErrorAlert(error, 'Logout');
    window.location.href = "login.html";
  }
}

// Legacy snack functions removed - now using camera renting system
