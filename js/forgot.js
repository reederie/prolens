const API_URL = 'https://prolens.ccs4thyear.com';

// DOM elements
const stepEmail = document.getElementById('step-email');
const stepOtp = document.getElementById('step-otp');
const stepReset = document.getElementById('step-reset');

const forgotEmailInput = document.getElementById('forgotEmail');
const otpInput = document.getElementById('otpInput');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

const emailMsg = document.getElementById('emailMsg');
const otpMsg = document.getElementById('otpMsg');
const resetMsg = document.getElementById('resetMsg');

// Global variables to store data
let userEmail = '';
let verifiedOtp = '';

// Step 1: Send OTP
sendOtpBtn.addEventListener('click', async () => {
    const email = forgotEmailInput.value.trim();
    
    if (!email) {
        showMessage(emailMsg, 'Please enter your email address.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(emailMsg, 'Please enter a valid email address.', 'error');
        return;
    }

    try {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(sendOtpBtn, true);
        } else {
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = 'Sending...';
        }
        
        const response = await axios.post(`${API_URL}/api/forgot-password/send-otp`, { email });

        if (response.status === 200) {
            // Store email BEFORE showing success message
            userEmail = email;
            console.log('Email stored:', userEmail);
            
            // Use the styled message function if available, otherwise use the simple one
            if (window.showStyledMessage) {
                window.showStyledMessage('emailMsg', response.data.message, 'success');
            } else {
                showMessage(emailMsg, response.data.message, 'success');
            }
            
            // Move to step 2 immediately after successful response
            setTimeout(() => {
                if (window.showStep) {
                    window.showStep('step-otp');
                } else {
                    stepEmail.style.display = 'none';
                    stepOtp.style.display = 'flex';
                    // Update step indicator manually if showStep is not available
                    updateStepIndicator(2);
                }
                // Clear email input message after transition
                setTimeout(() => {
                    emailMsg.textContent = '';
                    emailMsg.className = 'error-message';
                }, 100);
            }, 1000);
        } else {
            showMessage(emailMsg, response.data.error, 'error');
        }
    } catch (error) {
        console.error('Send OTP Error:', error);
        if (window.showErrorAlert) {
            showErrorAlert(error, 'Send OTP');
        }
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.error || error.response.data.message || 'Failed to send OTP. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('emailMsg', errorMsg, 'error');
            } else {
                showMessage(emailMsg, errorMsg, 'error');
            }
        } else {
            const errorMsg = 'Network error. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('emailMsg', errorMsg, 'error');
            } else {
                showMessage(emailMsg, errorMsg, 'error');
            }
        }
    } finally {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(sendOtpBtn, false);
        } else {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        }
    }
});

// Step 2: Verify OTP
verifyOtpBtn.addEventListener('click', async () => {
    const otp = otpInput.value.trim();
    
    if (!otp) {
        showMessage(otpMsg, 'Please enter the OTP.', 'error');
        return;
    }

    if (otp.length !== 6) {
        showMessage(otpMsg, 'OTP must be 6 digits.', 'error');
        return;
    }

    try {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(verifyOtpBtn, true);
        } else {
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.textContent = 'Verifying...';
        }
        
        const response = await axios.post(`${API_URL}/api/forgot-password/verify-otp`, { 
            email: userEmail, 
            otp: otp 
        });

        if (response.status === 200) {
            // Store the OTP BEFORE showing success message
            verifiedOtp = otp;
            console.log('OTP verified and stored:', verifiedOtp);
            console.log('Email is:', userEmail);
            
            // Use the styled message function if available
            if (window.showStyledMessage) {
                window.showStyledMessage('otpMsg', response.data.message, 'success');
            } else {
                showMessage(otpMsg, response.data.message, 'success');
            }
            
            // Move to step 3 after 1 second
            setTimeout(() => {
                if (window.showStep) {
                    window.showStep('step-reset');
                } else {
                    stepOtp.style.display = 'none';
                    stepReset.style.display = 'flex';
                    // Update step indicator manually if showStep is not available
                    updateStepIndicator(3);
                }
                // Clear OTP input message after transition
                setTimeout(() => {
                    otpMsg.textContent = '';
                    otpMsg.className = 'error-message';
                }, 100);
            }, 1000);
        } else {
            showMessage(otpMsg, response.data.error, 'error');
        }
    } catch (error) {
        console.error('Verify OTP Error:', error);
        if (window.showErrorAlert) {
            showErrorAlert(error, 'Verify OTP');
        }
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.error || error.response.data.message || 'Failed to verify OTP. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('otpMsg', errorMsg, 'error');
            } else {
                showMessage(otpMsg, errorMsg, 'error');
            }
        } else {
            const errorMsg = 'Network error. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('otpMsg', errorMsg, 'error');
            } else {
                showMessage(otpMsg, errorMsg, 'error');
            }
        }
    } finally {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(verifyOtpBtn, false);
        } else {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = 'Verify OTP';
        }
    }
});

// Step 3: Reset Password
resetPasswordBtn.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Add debug logging
    console.log('Reset attempt with:');
    console.log('- Email:', userEmail);
    console.log('- OTP:', verifiedOtp);
    console.log('- New password length:', newPassword.length);
    
    if (!newPassword || !confirmPassword) {
        showMessage(resetMsg, 'Please fill in all fields.', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage(resetMsg, 'Password must be at least 6 characters.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage(resetMsg, 'Passwords do not match.', 'error');
        return;
    }

    // Verify we have email and OTP
    if (!userEmail || !verifiedOtp) {
        showMessage(resetMsg, 'Session expired. Please start over.', 'error');
        setTimeout(() => {
            window.location.href = 'forgot.html';
        }, 2000);
        return;
    }

    try {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(resetPasswordBtn, true);
        } else {
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.textContent = 'Resetting...';
        }
        
        const response = await axios.post(`${API_URL}/api/forgot-password/reset`, { 
            email: userEmail, 
            otp: verifiedOtp,
            new_password: newPassword
        });

        if (response.status === 200) {
            showMessage(resetMsg, response.data.message, 'success');
            
            // Clear stored data
            userEmail = '';
            verifiedOtp = '';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            console.error('Reset failed:', response.data);
            showMessage(resetMsg, response.data.error, 'error');
        }
    } catch (error) {
        console.error('Reset Password Error:', error);
        if (window.showErrorAlert) {
            showErrorAlert(error, 'Reset Password');
        }
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.error || error.response.data.message || 'Failed to reset password. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('resetMsg', errorMsg, 'error');
            } else {
                showMessage(resetMsg, errorMsg, 'error');
            }
        } else {
            const errorMsg = 'Network error. Please try again.';
            if (window.showStyledMessage) {
                window.showStyledMessage('resetMsg', errorMsg, 'error');
            } else {
                showMessage(resetMsg, errorMsg, 'error');
            }
        }
    } finally {
        // Use styled button loading if available
        if (window.setStyledButtonLoading) {
            window.setStyledButtonLoading(resetPasswordBtn, false);
        } else {
            resetPasswordBtn.disabled = false;
            resetPasswordBtn.textContent = 'Reset Password';
        }
    }
});

// Utility function to update step indicator (fallback if not available from HTML)
function updateStepIndicator(activeStep) {
    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.step-line');
    
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < activeStep - 1) {
            step.classList.add('completed');
        } else if (index === activeStep - 1) {
            step.classList.add('active');
        }
    });
    
    lines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index < activeStep - 1) {
            line.classList.add('completed');
        }
    });
}

// Utility functions
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = type === 'success' ? 'error-message success' : 'error-message error';
    element.style.display = 'block';
    element.classList.add('show');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        element.classList.remove('show');
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Allow only numbers in OTP input
otpInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Auto-focus next input after email
forgotEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendOtpBtn.click();
    }
});

// Auto-focus next input after OTP
otpInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyOtpBtn.click();
    }
});

// Auto-submit on Enter in password fields
confirmPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        resetPasswordBtn.click();
    }
});