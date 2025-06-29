/**
 * Get standardized cookie options for auth tokens
 * @param {number} maxAge - Maximum age for the cookie in milliseconds
 * @returns {object} Cookie configuration object
 */
const getCookieOptions = (maxAge = 24 * 60 * 60 * 1000) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const options = {
        httpOnly: true,
        secure: isProduction || process.env.HTTPS === 'true',
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        // Only set domain in production for cross-subdomain sharing
        // Omit domain for same-origin requests to avoid issues
        ...(isProduction && { domain: '.vercel.app' }),
        maxAge
    };
    
    // Debug logging in development
    if (!isProduction) {
        console.log('Cookie options:', options);
    }
    
    return options;
};

/**
 * Get cookie options for clearing cookies (without maxAge)
 * @returns {object} Cookie configuration object for clearing
 */
const getClearCookieOptions = () => {
    const { maxAge, ...options } = getCookieOptions();
    return options;
};

module.exports = {
    getCookieOptions,
    getClearCookieOptions
};
