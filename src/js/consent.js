import { launchGTM } from '/js/gtm.js';

//data policy consent

function initConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted') {
        launchGTM();
    } else if (!consent) {
        if (banner) banner.classList.remove('hidden');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            if (banner) banner.classList.add('hidden');
            launchGTM();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'declined');
            if (banner) banner.classList.add('hidden');
            console.log("SYSTEM: TRACKING DISENGAGED");
        });
    }
}

