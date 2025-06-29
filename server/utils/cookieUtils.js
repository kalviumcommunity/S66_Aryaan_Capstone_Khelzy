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
        maxAge
    };
    
    // Debug logging for all environments to troubleshoot production issues
    console.log('Cookie options created:', {
        ...options,
        environment: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
    });
    
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
