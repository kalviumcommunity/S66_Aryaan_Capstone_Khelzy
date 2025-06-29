// Cookie debugging utilities for development
// Add this to your browser console to debug cookie issues

// Function to list all cookies
function listAllCookies() {
  console.log('All cookies:', document.cookie);
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    console.log('Cookie:', cookie.trim());
  });
}

// Function to manually clear all cookies
function clearAllCookies() {
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    console.log('Clearing cookie:', name.trim());
    
    // Clear with different path and domain combinations
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + window.location.hostname;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=none";
  });
  console.log('All cookies cleared');
}

// Function to check specific auth cookies
function checkAuthCookies() {
  const cookies = document.cookie.split(';');
  const authCookies = cookies.filter(cookie => 
    cookie.includes('token') || cookie.includes('refreshToken')
  );
  console.log('Auth cookies found:', authCookies);
  return authCookies.length > 0;
}

console.log('Cookie debugging utilities loaded. Use:');
console.log('- listAllCookies() to see all cookies');
console.log('- clearAllCookies() to manually clear all cookies');
console.log('- checkAuthCookies() to check for auth tokens');
