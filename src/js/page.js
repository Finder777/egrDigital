import {
    loadLocStat,
    saveLocStat,
    copyLocStat,
    textLocStat,
    renderHistoryTable,
} from './locstat.js';

import { updateWeather } from './weatherEngine.js';
import { updateAirspace } from './radar.js';
import { initLeafletMap } from './map.js';
import { deviceStats } from './deviceStats.js';
import { updateCommsIntercept } from './connectivity.js';
import { startTypewriter } from './typewriter.js';

export function bindLocStatControls() {
    const saveBtn = document.getElementById('send-locstat');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveLocStat);
    }

    const copyBtn = document.getElementById('copy-locstat');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyLocStat);
    }

    const textLocationButton = document.getElementById('text-locstat');
    if (textLocationButton) {
        textLocationButton.addEventListener('click', textLocStat);
    }
}

export function initPageAfterConsent() {
    loadLocStat({
        onReady: ({ currentLat, currentLon }) => {
            const textLocationButton = document.getElementById('text-locstat');
            if (textLocationButton) {
                textLocationButton.disabled = false;
            }

            updateWeather(currentLat, currentLon);
            updateAirspace(currentLat, currentLon);
            initLeafletMap(currentLat, currentLon);
            deviceStats();
            updateCommsIntercept();
            startTypewriter('analytics');
        },
    });

    renderHistoryTable();
    bindLocStatControls();
}

function showConsentBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    const locationDisplay = document.getElementById('location');

    if (banner) banner.classList.remove('hidden');

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        if (banner) banner.classList.add('hidden');
        initPageAfterConsent();
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        if (banner) banner.classList.add('hidden');
        if (locationDisplay) {
            locationDisplay.textContent = 'Consent required to use location tracking.';
        }
    });
}

export function initConsent() {
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted') {
        initPageAfterConsent();
    } else {
        showConsentBanner();
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initConsent();
    });
}