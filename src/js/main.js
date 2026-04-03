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

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initConsent();
});