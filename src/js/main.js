/**
 * EGR DIGITAL: SYSTEM GATEKEEPER
 * Handles GTM Injection and Privacy Consent
 */

const GTM_ID = 'GTM-WZ7CP98K';

function launchGTM() {
    if (window.gtmInitialized) return;
    
    (function(w,d,s,l,i){
        w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', GTM_ID);
    
    window.gtmInitialized = true;
    console.log("SYSTEM: GTM PROTOCOLS ONLINE");
}

function initConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    // Check localStorage for existing choice
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted') {
        launchGTM();
    } else if (!consent) {
        // Show banner only if no previous choice was made
        if (banner) banner.classList.remove('hidden');
    }

    // Accept Protocol
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            if (banner) banner.classList.add('hidden');
            launchGTM();
        });
    }

    // Decline Protocol
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'declined');
            if (banner) banner.classList.add('hidden');
            console.log("SYSTEM: TRACKING DISENGAGED");
        });
    }
}

// Utility: Auto-update the year in the footer/hero
const updateYear = () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    updateYear();
    initConsent();
});