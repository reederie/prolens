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
    const pathname = window.location.pathname;
    
    // Frontend URL - GitHub Pages
    const FRONTEND_URL = 'https://reederie.github.io/prolens';
    
    // If we're on the backend API domain (prolens.ccs4thyear.com)
    // Redirect to GitHub Pages frontend
    if (hostname.includes('prolens.ccs4thyear.com') || hostname.includes('ccs4thyear.com')) {
      return FRONTEND_URL + '/login.html?activated=1';
    }
    
    // If we're on GitHub Pages (reederie.github.io)
    if (hostname.includes('reederie.github.io')) {
      // GitHub Pages structure: https://reederie.github.io/prolens
      // Extract the base path (everything before the filename)
      const basePath = pathname.substring(0, pathname.lastIndexOf('/'));
      // If we're in /api path or root, go to /prolens/login.html
      if (pathname.includes('/api/') || pathname === '/' || pathname === '' || pathname === '/prolens' || pathname === '/prolens/') {
        return '/prolens/login.html?activated=1';
      }
      // Otherwise use relative path from current location
      if (basePath && basePath !== '/') {
        return basePath + '/login.html?activated=1';
      }
      return '/prolens/login.html?activated=1';
    }
    
    // For localhost or other domains, always redirect to GitHub Pages
    // This ensures consistent behavior regardless of where the page is served from
    return FRONTEND_URL + '/login.html?activated=1';
  }
  
  const correctLoginUrl = getLoginUrl();
  
  // Log for debugging
  console.log('Activation Fix Script Loaded');
  console.log('Current URL:', window.location.href);
  console.log('Correct Login URL:', correctLoginUrl);
  
  // Intercept navigation attempts
  let isRedirecting = false;
  
  // Intercept window.location.href assignments (if possible)
  try {
    const originalLocation = window.location;
    let locationProxy = new Proxy(originalLocation, {
      set: function(target, property, value) {
        if (property === 'href' && typeof value === 'string' && (
          value.includes('127.0.0.1') || 
          value.includes('localhost') || 
          value.includes('/frontend/login') ||
          (value.includes('login') && (value.includes(':5500') || value.includes(':8000')))
        )) {
          isRedirecting = true;
          target.href = correctLoginUrl;
          return true;
        }
        target[property] = value;
        return true;
      }
    });
    // Note: We can't fully override window.location, but we'll catch clicks and href changes
  } catch (e) {
    // Proxy not available or location can't be proxied, use click interception only
    console.log('Using click interception method');
  }
  
  // Intercept beforeunload to catch any last-minute redirects
  window.addEventListener('beforeunload', function(e) {
    const currentHref = window.location.href;
    if (currentHref.includes('127.0.0.1') || currentHref.includes('localhost') || 
        currentHref.includes('/frontend/login') ||
        (currentHref.includes('login') && (currentHref.includes(':5500') || currentHref.includes(':8000')))) {
      e.preventDefault();
      window.location.href = correctLoginUrl;
    }
  });

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
          e.stopImmediatePropagation();
          isRedirecting = true;
          window.location.href = correctLoginUrl;
          return false;
        }
      }
      
      // Check if it's a button with login-related text
      if (target.tagName === 'BUTTON' || target.classList.contains('btn') || target.hasAttribute('role') && target.getAttribute('role') === 'button') {
        const text = (target.textContent || target.innerText || '').toLowerCase();
        if (text.includes('proceed to login') || text.includes('go to login') || 
            (text.includes('login') && (text.includes('proceed') || text.includes('go')))) {
          // Check if there's an onclick that might have wrong URL
          const onclick = target.getAttribute('onclick');
          if (onclick && (onclick.includes('127.0.0.1') || onclick.includes('localhost') || 
              onclick.includes('/frontend/login') || onclick.includes(':5500') || onclick.includes(':8000'))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            isRedirecting = true;
            window.location.href = correctLoginUrl;
            return false;
          }
          // If no onclick but button text suggests login, intercept it
          if (!onclick || onclick.trim() === '') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            isRedirecting = true;
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
    
    // Fix all links - be very aggressive
    const links = document.querySelectorAll('a[href], [href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = (link.textContent || link.innerText || '').toLowerCase();
      
      // Fix incorrect login URLs - catch all variations
      if (href && (
        href.includes('127.0.0.1') || 
        href.includes('localhost') || 
        href.includes('/frontend/login') ||
        href.includes('/frontend/login.html') ||
        (href.includes('login') && (href.includes(':5500') || href.includes(':8000')))
      )) {
        // Force update the href
        link.setAttribute('href', loginUrl);
        link.href = loginUrl;
        
        // Remove any existing onclick
        link.removeAttribute('onclick');
        
        // Override onclick completely
        link.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          isRedirecting = true;
          window.location.href = loginUrl;
          return false;
        };
        
        // Also add event listener as backup
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          isRedirecting = true;
          window.location.href = loginUrl;
          return false;
        }, true);
      }
      // Also fix login links that don't have the activated parameter
      else if (href && href.includes('login.html') && !href.includes('activated=') && 
               (text.includes('proceed') || text.includes('login') || text.includes('go'))) {
        // Add activated parameter if not present
        const separator = href.includes('?') ? '&' : '?';
        const newHref = href + separator + 'activated=1';
        link.setAttribute('href', newHref);
        link.href = newHref;
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

