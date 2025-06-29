/**
 * Get standardized cookie options for auth tokens
 * @param {number} maxAge - Maximum age for the cookie in milliseconds
 * @returns {object} Cookie configuration object
 */
const getCookieOptions = (maxAge = 24 * 60 * 60 * 1000) => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.HTTPS === 'true',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
        maxAge
    };
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
