// --- GLOBAL STATE & IMPORTS ---
export let currentLat = null;
export let currentLon = null;

import { updateWeather } from './weatherEngine.js';
import { updateAirspace } from './radar.js';
import { initLeafletMap } from './map.js';
import { deviceStats } from './deviceStats.js';
import { updateCommsIntercept } from './connectivity.js';

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
        deviceStats();
        updateCommsIntercept();
    });
}

