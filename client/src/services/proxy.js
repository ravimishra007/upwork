import { apiClient } from './apiClient';

console.log('🔄 Setting up API proxy interception');

// Store the original fetch function
const originalFetch = window.fetch;

// Override the global fetch function
window.fetch = async function(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  console.log(`💬 Request to: ${url}`);
  
  // Only intercept API calls
  if (url.includes('/api/')) {
    console.log(`🔵 Intercepting API request: ${url}`);
    
    try {
      // Extract the endpoint from the URL, preserving the full path including IDs
      let endpoint = '';
      if (url.startsWith('/api')) {
        endpoint = url;
      } else {
        const apiPathStart = url.indexOf('/api/');
        if (apiPathStart >= 0) {
          endpoint = url.substring(apiPathStart);
        } else {
          endpoint = `/api/${url.split('/api/')[1]}`;
        }
      }
      
      console.log(`🔍 Using endpoint: ${endpoint}`);
      
      // Use our apiClient to handle the request
      const data = await apiClient.get(endpoint);
      
      // Create a mock successful response
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => data,
        text: async () => JSON.stringify(data),
        clone: function() { return this; }
      };
    } catch (error) {
      console.error(`❌ Error intercepting API request ${url}:`, error);
      
      // Create a mock error response
      return {
        ok: false,
        status: 500,
        statusText: error.message || 'Internal Error',
        headers: new Headers({ 'Content-Type': 'text/plain' }),
        json: async () => ({ error: error.message }),
        text: async () => error.message,
        clone: function() { return this; }
      };
    }
  }
  
  // For non-API requests, use the original fetch
  console.log(`➡️ Passing through request: ${url}`);
  return originalFetch(input, init);
};

// Intercept XMLHttpRequest as well
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  if (url.includes('/api/')) {
    console.log(`🟠 Intercepting XHR request to ${url}`);
    // Replace with a URL that will be handled by our fetch interceptor
    this._apiUrl = url;
    url = '/interception-placeholder';
  }
  return originalXHROpen.call(this, method, url, ...rest);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(...args) {
  if (this._apiUrl) {
    console.log(`🟠 Handling intercepted XHR request to ${this._apiUrl}`);
    
    // Use our custom fetch to get the data
    (async () => {
      try {
        const response = await window.fetch(this._apiUrl);
        const data = await response.json();
        
        // Simulate successful XHR response
        Object.defineProperty(this, 'readyState', { value: 4 });
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'responseText', { value: JSON.stringify(data) });
        this.onreadystatechange && this.onreadystatechange();
        this.onload && this.onload();
      } catch (error) {
        // Simulate XHR error
        Object.defineProperty(this, 'readyState', { value: 4 });
        Object.defineProperty(this, 'status', { value: 500 });
        Object.defineProperty(this, 'responseText', { value: JSON.stringify({ error: error.message }) });
        this.onreadystatechange && this.onreadystatechange();
        this.onerror && this.onerror(error);
      }
    })();
    
    // Don't actually send the XHR
    return;
  }
  
  // For non-API requests, use the original send
  return originalXHRSend.apply(this, args);
};

// Output a confirmation message
console.log('✅ API proxy interception set up successfully'); 