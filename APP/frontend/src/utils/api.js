const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token && !options.noAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "An error occurred");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
