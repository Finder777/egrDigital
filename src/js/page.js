// --- GLOBAL STATE & IMPORTS ---
export let currentLat = null;
export let currentLon = null;
export let gpsTimestamp = null;

import { getLocation } from './locationEngine.js';
import { updateWeather } from './weatherEngine.js';
import { updateAirspace } from './radar.js';
import { initLeafletMap } from './map.js';
import { deviceStats } from './deviceStats.js';
import { updateCommsIntercept } from './connectivity.js';

// --- CENTRAL DATA ENGINE ---
export async function loadLocStat() {
    const locationDisplay = document.getElementById('location');
    const dateDisplay = document.getElementById('current-date');
    const timeDisplay = document.getElementById('current-time');
    if (locationDisplay) locationDisplay.textContent = 'Finding GPS COORDS for your location...';

    try {
        const position = await getLocation();

        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;

        gpsTimestamp = new Date(position.timestamp);
        
        if (dateDisplay) dateDisplay.textContent = `Date: ${gpsTimestamp.toLocaleDateString()}`;
        if (timeDisplay) timeDisplay.textContent = `Time: ${gpsTimestamp.toLocaleTimeString()}`;

        const gpsCoords = `LAT: ${currentLat.toFixed(4)}, LON: ${currentLon.toFixed(4)}`;
        console.log(`Location obtained: ${gpsCoords}`);

        if (locationDisplay) locationDisplay.textContent = `GPS COORDS: ${gpsCoords}`;

        document.querySelectorAll('.coord-display').forEach(el => {el.textContent = gpsCoords});

        updateWeather(currentLat, currentLon);
        updateAirspace(currentLat, currentLon);
        initLeafletMap(currentLat, currentLon);
        deviceStats();
        updateCommsIntercept();

        }
    
    catch (error) {
        console.error('Error obtaining location:', error);
        if (locationDisplay) locationDisplay.textContent = 'Unable to obtain GPS COORDS. Please allow location access and refresh the page.';
    }
}

export function saveLocStat() {
    // Check if we have the data ready
    if (currentLat !== null && currentLon !== null && gpsTimestamp !== null) {
        
        const readableTime = `${gpsTimestamp.toLocaleDateString()} ${gpsTimestamp.toLocaleTimeString()}`;

        let history = JSON.parse(localStorage.getItem('position_logs')) || [];

        const newEntry = { 
            timestamp: readableTime, 
            lat: currentLat.toFixed(4), 
            lon: currentLon.toFixed(4) 
        };

        history.unshift(newEntry);
        if (history.length > 50) history = history.slice(0, 50);

        localStorage.setItem('position_logs', JSON.stringify(history));
        renderHistoryTable();
        
    } else {
        console.warn("Cannot save: No GPS data in memory.");
    }
}

// --- Table for saved locstat ---
export function renderHistoryTable() {
    const tableBody = document.getElementById('position-data-rows');
    const history = JSON.parse(localStorage.getItem('position_logs')) || [];

    if (tableBody) {
        tableBody.innerHTML = history.map(entry => `
            <tr>
                <td>${entry.timestamp}</td>
                <td>${entry.lat}</td>
                <td>${entry.lon}</td>
            </tr>
        `).join('');
    }
}
