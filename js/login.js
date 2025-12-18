// login.js - jQuery version - Handle Login Form

$(function() {
  const $loginForm = $('#loginForm');

  if ($loginForm.length) {
    $loginForm.on('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = {
        username: formData.get("username"),
        password: formData.get("password")
      };

      try {
        const response = await $.ajax({
          url: 'https://prolens.ccs4thyear.com/api/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data)
        });

        // ✅ Store token and user info
        localStorage.setItem("authToken", response.token);
        if (response.user) {
          localStorage.setItem("userRole", response.user.role);
          localStorage.setItem("userInfo", JSON.stringify(response.user));
        }

        alert("Login successful!");
        
        // Redirect to unified dashboard; it will show role-specific content
        window.location.href = "dashboard.html";
      } catch (err) {
        console.error("Login error:", err);
        // Convert jQuery error to axios-like format for showErrorAlert
        const error = new Error(err.statusText || 'Request failed');
        error.response = {
          status: err.status,
          statusText: err.statusText,
          data: err.responseJSON || err.responseText
        };
        showErrorAlert(error, 'Login');
      }
    });
  }
});
