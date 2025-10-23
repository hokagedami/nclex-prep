const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Log API configuration
console.log('=== Frontend API Configuration ===');
console.log('API_URL:', API_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Environment Mode:', import.meta.env.MODE);
console.log('===================================');

class ApiClient {
  async request(endpoint, options = {}) {
    const timestamp = new Date().toISOString();
    const fullUrl = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    console.log(`[${timestamp}] API Request:`, {
      method: options.method || 'GET',
      url: fullUrl,
      endpoint,
      hasToken: !!token,
      hasBody: !!options.body
    });

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      console.log(`[${timestamp}] Fetching:`, fullUrl);
      console.log(`[${timestamp}] Request config:`, {
        method: config.method || 'GET',
        headers: config.headers,
        bodyLength: config.body ? config.body.length : 0
      });

      const response = await fetch(fullUrl, config);

      console.log(`[${timestamp}] Response received:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      let data;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log(`[${timestamp}] Response data:`, data);
      } else {
        const text = await response.text();
        console.log(`[${timestamp}] Response text:`, text);
        data = { error: 'Invalid response format', text };
      }

      if (!response.ok) {
        const error = new Error(data.error || data.message || 'Something went wrong');
        error.status = response.status;
        error.data = data;
        console.error(`[${timestamp}] API Error:`, {
          status: response.status,
          error: error.message,
          data
        });
        throw error;
      }

      console.log(`[${timestamp}] API Success:`, endpoint);
      return data;

    } catch (error) {
      console.error(`[${timestamp}] API Request Failed:`, {
        endpoint,
        url: fullUrl,
        error: error.message,
        name: error.name,
        stack: error.stack
      });

      // Enhanced error message for "Failed to fetch"
      if (error.message === 'Failed to fetch') {
        console.error(`[${timestamp}] Network Error Details:`, {
          possibleCauses: [
            'CORS issue - backend not allowing frontend origin',
            'Backend server is down or not reachable',
            'Wrong API URL configured',
            'SSL/HTTPS certificate issue',
            'Network connectivity problem'
          ],
          apiUrl: API_URL,
          endpoint,
          fullUrl
        });

        // Create a more descriptive error
        const enhancedError = new Error(
          `Network request failed. Cannot reach server at ${API_URL}. Check console for details.`
        );
        enhancedError.originalError = error;
        enhancedError.endpoint = endpoint;
        enhancedError.url = fullUrl;
        throw enhancedError;
      }

      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

export const api = new ApiClient();
