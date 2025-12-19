// activation-fix.js
// This script fixes incorrect redirects on the activation page
// It intercepts all navigation attempts and fixes incorrect login URLs

(function() {
  'use strict';
  
  // Function to get the correct login URL based on current location
  function getLoginUrl() {
    const origin = window.location.origin;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // If we're on the production domain (prolens.ccs4thyear.com)
    if (hostname.includes('prolens.ccs4thyear.com')) {
      // The frontend login page should be at the same domain
      // Try to determine if we're in /api path and adjust accordingly
      const pathname = window.location.pathname;
      if (pathname.includes('/api/')) {
        // We're in API path, go to root for frontend
        return '/login.html?activated=1';
      }
      return '/login.html?activated=1';
    }
    
    // For localhost or other domains, use relative path
    // This will work for same-origin requests
    // Add activated parameter to show success message
    return 'login.html?activated=1';
  }
  
  const correctLoginUrl = getLoginUrl();
  
  // Intercept all clicks on the page
  document.addEventListener('click', function(e) {
    let target = e.target;
    
    // Find the closest link or button
    while (target && target !== document.body) {
      // Check if it's a link
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && (
          href.includes('127.0.0.1') || 
          href.includes('localhost') || 
          href.includes('/frontend/login') ||
          (href.includes('login') && (href.includes(':5500') || href.includes(':8000')))
        )) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = correctLoginUrl;
          return false;
        }
      }
      
      // Check if it's a button with login-related text
      if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
        const text = (target.textContent || target.innerText || '').toLowerCase();
        if (text.includes('proceed to login') || text.includes('go to login') || 
            (text.includes('login') && text.includes('proceed'))) {
          // Check if there's an onclick that might have wrong URL
          const onclick = target.getAttribute('onclick');
          if (onclick && (onclick.includes('127.0.0.1') || onclick.includes('localhost') || 
              onclick.includes('/frontend/login'))) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = correctLoginUrl;
            return false;
          }
          // If no onclick but button text suggests login, intercept it
          if (!onclick || onclick.trim() === '') {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = correctLoginUrl;
            return false;
          }
        }
      }
      
      target = target.parentElement;
    }
  }, true); // Use capture phase to catch early
  
  // Fix all existing links and buttons on page load
  function fixLoginRedirects() {
    const loginUrl = correctLoginUrl;
    
    // Fix all links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = (link.textContent || link.innerText || '').toLowerCase();
      // Fix incorrect login URLs
      if (href && (
        href.includes('127.0.0.1') || 
        href.includes('localhost') || 
        href.includes('/frontend/login') ||
        (href.includes('login') && (href.includes(':5500') || href.includes(':8000')))
      )) {
        link.href = loginUrl;
        // Override onclick
        link.onclick = function(e) {
          e.preventDefault();
          window.location.href = loginUrl;
          return false;
        };
      }
      // Also fix login links that don't have the activated parameter
      else if (href && href.includes('login.html') && !href.includes('activated=') && 
               (text.includes('proceed') || text.includes('login'))) {
        // Add activated parameter if not present
        const separator = href.includes('?') ? '&' : '?';
        link.href = href + separator + 'activated=1';
      }
    });
    
    // Fix buttons with onclick handlers
    const buttons = document.querySelectorAll('button[onclick], .btn[onclick]');
    buttons.forEach(button => {
      const onclick = button.getAttribute('onclick');
      if (onclick && (
        onclick.includes('127.0.0.1') || 
        onclick.includes('localhost') || 
        onclick.includes('/frontend/login') ||
        (onclick.includes('login') && (onclick.includes(':5500') || onclick.includes(':8000')))
      )) {
        button.onclick = function(e) {
          e.preventDefault();
          window.location.href = loginUrl;
          return false;
        };
      }
    });
    
    // Fix buttons by text content (for buttons without href/onclick)
    const allButtons = document.querySelectorAll('button, .btn, [role="button"]');
    allButtons.forEach(button => {
      const text = (button.textContent || button.innerText || '').toLowerCase();
      if ((text.includes('proceed to login') || text.includes('go to login')) && 
          !button.getAttribute('onclick') && 
          !button.getAttribute('href')) {
        button.onclick = function(e) {
          e.preventDefault();
          window.location.href = loginUrl;
          return false;
        };
      }
    });
  }
  
  // Run immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLoginRedirects);
  } else {
    fixLoginRedirects();
  }
  
  // Run again after delays to catch any dynamically added content
  setTimeout(fixLoginRedirects, 100);
  setTimeout(fixLoginRedirects, 500);
  setTimeout(fixLoginRedirects, 1000);
  
})();

