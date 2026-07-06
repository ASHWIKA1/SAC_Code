import axios from 'axios';

const getBaseURL = () => {
  const { protocol, hostname, port } = window.location;
  // If running locally under Vite dev server, proxy/forward to Spring Boot local port 8085
  if (port === '5173') {
    return 'http://localhost:8085';
  }
  // In production, the React app is served by Spring Boot itself, so use the same origin
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
};

const getBasename = () => {
  return window.location.port === '5173' ? '' : '/testing_of_sac';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token from localStorage and handle subpath prefixing in production
api.interceptors.request.use((config) => {
  if (window.location.port !== '5173') {
    const subpath = '/testing_of_sac';
    if (config.url) {
      const normalizedUrl = config.url.startsWith('/') ? config.url : '/' + config.url;
      if (!normalizedUrl.startsWith(subpath)) {
        config.url = `${subpath}${normalizedUrl}`;
      }
    }
  }
  const token = localStorage.getItem('sac_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sac_token');
      localStorage.removeItem('sac_user');
      window.location.href = getBasename() + '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
