import { launchGTM } from '/js/gtm.js';
import { loadAnalyticsData } from './page.js';

//data policy stuff

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
    loadAnalyticsData();
});

// --- UI EVENT LISTENERS & STUFF ---

document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.querySelector('a[href="#explore"]');
    const modalSection = document.getElementById('explore');
    const closeBtn = document.getElementById('closeModal');

    exploreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modalSection.classList.add('show');
    });

    closeBtn?.addEventListener('click', () => {
        modalSection.classList.remove('show');
    });

    modalSection?.addEventListener('click', (e) => {
        if (e.target === modalSection) modalSection.classList.remove('show');
    });
});

const toggleBtn = document.getElementById('hero-toggle');
const hero = document.getElementById('hero-section');
const icon = toggleBtn.querySelector('i');

toggleBtn.addEventListener('click', () => {
    const isCollapsed = hero.classList.toggle('collapsed');

    if (isCollapsed) {
        icon.classList.remove('fa-window-minimize');
        icon.classList.add('fa-window-restore');
    } else {
        icon.classList.remove('fa-window-restore');
        icon.classList.add('fa-window-minimize');
    }
});