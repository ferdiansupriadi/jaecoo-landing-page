/**
 * Configuration file for JAECOO Website
 * Security: Keep sensitive values in environment variables
 * Never commit actual credentials to version control
 */

const CONFIG = {
    // Contact Information
    whatsappNumber: window.JAECOO_CONFIG?.whatsappNumber || '6281804110901',
    phoneNumber: window.JAECOO_CONFIG?.phoneNumber || '6281804110901',
    email: window.JAECOO_CONFIG?.email || 'ferdiansupriadi@gmail.com',
    
    // API Configuration
    googleAnalyticsId: window.JAECOO_CONFIG?.googleAnalyticsId || null,
    
    // Feature Flags
    useServerSideCounter: true, // Switch from CountAPI to server-side
    enableVisitorCounter: true,
    
    // Carousel Configuration
    autoScrollInterval: 4500, // milliseconds
    
    // Accessibility
    enableKeyboardNavigation: true,
    reducedMotionPreference: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

/**
 * Get configuration value with fallback
 */
function getConfig(key) {
    return CONFIG[key] || null;
}

/**
 * Initialize configuration from HTML data attributes
 * Usage: <html data-whatsapp="6281804110901" data-analytics="G-XXXXX">
 */
function initializeConfigFromDOM() {
    const htmlElement = document.documentElement;
    
    if (htmlElement.dataset.whatsapp) {
        CONFIG.whatsappNumber = htmlElement.dataset.whatsapp;
    }
    if (htmlElement.dataset.phone) {
        CONFIG.phoneNumber = htmlElement.dataset.phone;
    }
    if (htmlElement.dataset.email) {
        CONFIG.email = htmlElement.dataset.email;
    }
    if (htmlElement.dataset.analytics) {
        CONFIG.googleAnalyticsId = htmlElement.dataset.analytics;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConfigFromDOM);
} else {
    initializeConfigFromDOM();
}
