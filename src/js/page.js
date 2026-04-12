// --- GLOBAL STATE & IMPORTS ---
export let currentLat = null;
export let currentLon = null;

import { updateWeather } from './weatherEngine.js';
import { updateAirspace } from './radar.js';
import { initLeafletMap } from './map.js';

// --- CENTRAL DATA ENGINE ---
export function loadAnalyticsData() {
    return new Promise((resolve) => {

        const now = new Date();
        const dateElement = document.getElementById('current-date');
        if (dateElement) dateElement.textContent = `Date: ${now.toDateString()}`;

        const yearElement = document.getElementById('current-year');
        if (yearElement) yearElement.textContent = now.getFullYear().toString();

        const timeElement = document.getElementById('current-time');
        if (timeElement) timeElement.textContent = `Time: ${now.toLocaleTimeString()}`;

        const locationDisplayElement = document.getElementById('location');
        function updateLocationDisplay(text) {
            if (locationDisplayElement) {
                locationDisplayElement.textContent = `GPS Lat/ Long: ${text}`;
            }
        }
        
        updateLocationDisplay("Attempting to get location...");

        if (!("geolocation" in navigator)) {
            updateLocationDisplay("Geolocation not supported.");
            return resolve();
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;

                updateLocationDisplay(`${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`);
                
                // Update all section badges with the class .coord-display
                document.querySelectorAll('.coord-display').forEach(el => {
                    el.textContent = `${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`;
                });

                console.log("Geolocation: Success");
                
                initLeafletMap(currentLat, currentLon);
                updateWeather(currentLat, currentLon);
                updateAirspace(currentLat, currentLon);


                resolve();
            },
            error => {
                updateLocationDisplay("Permission denied.  Check settings");
                console.error("Geolocation Error:", error);
                resolve();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        // System Meta-Data
        const timezoneDisplayElement = document.getElementById('timezone');
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezoneDisplayElement) timezoneDisplayElement.textContent = `Timezone: ${userTimezone}`;

        const browserLanguage = navigator.language;
        const settingsLanguage = document.getElementById('language');
        if (settingsLanguage) settingsLanguage.textContent = `Language: ${browserLanguage}`;

        const screenWidthElement = document.getElementById('screen-width');
        if (screenWidthElement) screenWidthElement.textContent = `Screen Width: ${window.screen.width}`;
        
        const screenHeightElement = document.getElementById('screen-height');
        if (screenHeightElement) screenHeightElement.textContent = `Screen Height: ${window.screen.height}`;
        
        const userAgentElement = document.getElementById('user-agent');
        if (userAgentElement) userAgentElement.textContent = `User Agent: ${navigator.userAgent}`;
    });
}

// Eds best attempt

function updateCommsIntercept() {
    //  Establish the API connection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareDisplay = document.getElementById('hardware-type');
    const freqDisplay = document.getElementById('frequency');
    const downlinkDisplay = document.getElementById('downlink');
    const maxDownlinkCapacityDisplay = document.getElementById('max-downlink-capacity');
    const rttDisplay = document.getElementById('rtt');
    const saveDataDisplay = document.getElementById('save-data');
    
    // Guard Clause: If the browser doesn't support the API at all
    if (!connection) {
        if (hardwareDisplay) hardwareDisplay.textContent = "API UNAVAILABLE";
        return;
    }
    
    const hardware = connection.type || 'unavailable'; 
    const effectiveSpeed = connection.effectiveType || '[unknown]';
    const downlink = connection.downlink || '0';
    const maxDownlinkCapacity = connection.downlinkMax || '[unknown]';
    const rtt = connection.rtt || '--';
    const saveData = connection.saveData ? 'ENABLED' : 'DISABLED';

    // Update the UI
    if (hardwareDisplay) {
        hardwareDisplay.textContent = hardware.toUpperCase();
        // Visual cue: Amber if unavailable, Green if identified
        hardwareDisplay.style.color = (hardware === 'unavailable') ? '#ffaa00' : '#00ff00';
    }

    if (freqDisplay) {
        freqDisplay.textContent = effectiveSpeed.toUpperCase();
    }

    if (downlinkDisplay) {
        downlinkDisplay.textContent = `${downlink} Mb/s`;
    }

    if (maxDownlinkCapacityDisplay) {
        maxDownlinkCapacityDisplay.textContent = `${maxDownlinkCapacity} Mb/s`;
    }

    if (rttDisplay) {
        rttDisplay.textContent = `${rtt} ms`;
    }

    if (saveDataDisplay) {
        saveDataDisplay.textContent = saveData;
    }
}

window.addEventListener('load', updateCommsIntercept);

if (navigator.connection) {
    navigator.connection.addEventListener('change', updateCommsIntercept);
}