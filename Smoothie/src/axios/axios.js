// Import axios
import axios from 'axios';

// Create an axios instance with default settings
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  },
});

// Export the axios instance for use in other parts of your application
export default axiosInstance;
