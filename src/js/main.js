import { launchGTM } from '/js/gtm.js';

//data policy stuff

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

// --- INITIALIZE UI SYSTEMS ---
document.addEventListener('DOMContentLoaded', () => {
    initConsent();

    const exploreBtn = document.querySelector('a[href="#explore"]');
    const modalSection = document.getElementById('explore');
    const closeBtn = document.getElementById('closeModal');

    exploreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modalSection?.classList.add('show');
    });

    closeBtn?.addEventListener('click', () => modalSection?.classList.remove('show'));

    const toggleBtn = document.getElementById('hero-toggle');
    const hero = document.getElementById('hero-section');
    const icon = toggleBtn?.querySelector('i');

    toggleBtn?.addEventListener('click', () => {
        const isCollapsed = hero.classList.toggle('collapsed');
        if (icon) {
            icon.classList.toggle('fa-window-minimize', !isCollapsed);
            icon.classList.toggle('fa-window-restore', isCollapsed);
        }
    });
});