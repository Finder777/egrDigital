// --- GLOBAL STATE & IMPORTS ---
export let currentLat = null;
export let currentLon = null;
export let gpsTimestamp = null;
export let accuracy = null;
export let altitude = null;

import { getLocation } from './locationEngine.js';
import { updateWeather } from './weatherEngine.js';
import { updateAirspace } from './radar.js';
import { initLeafletMap } from './map.js';
import { deviceStats } from './deviceStats.js';
import { updateCommsIntercept } from './connectivity.js';

// --- LOCSTAT DATA ENGINE ---
export async function loadLocStat() {
    const locationDisplay = document.getElementById('location');
    const dateDisplay = document.getElementById('current-date');
    const timeDisplay = document.getElementById('current-time');
    if (locationDisplay) locationDisplay.textContent = 'Finding GPS COORDS for your location...';

    try {
        const position = await getLocation();

        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        altitude = position.coords.altitude;
        accuracy = position.coords.accuracy;
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
        
        const entryName = prompt("Enter a name for this location:", "My Location") || "UNNAMED";
        const readableTime = `${gpsTimestamp.toLocaleDateString()} ${gpsTimestamp.toLocaleTimeString()}`;

        let history = JSON.parse(localStorage.getItem('position_logs')) || [];

        const newEntry = { 
            timestamp: readableTime, 
            lat: currentLat.toFixed(4), 
            lon: currentLon.toFixed(4),
            accuracy: accuracy.toFixed(2),
            altitude: altitude ? altitude.toFixed(2) : 'N/A',
            name: entryName
        };

        history.unshift(newEntry);
        if (history.length > 50) history = history.slice(0, 50);

        localStorage.setItem('position_logs', JSON.stringify(history));
        renderHistoryTable();
        
    } else {
        console.warn("Cannot save: No GPS data in memory.");
    }
}

// --- Table to show the users saved locations ---
export function renderHistoryTable() {
    const tableBody = document.getElementById('position-data-rows');
    const history = JSON.parse(localStorage.getItem('position_logs')) || [];

    if (tableBody) {
        tableBody.innerHTML = history.map((entry, index) => `
            <tr>
                <td>${entry.timestamp}</td>
                <td>${entry.lat}</td>
                <td>${entry.lon}</td>
                <td>${entry.accuracy}</td>
                <td>${entry.altitude}</td>
                <td contenteditable= "true"
                class="edit-name" 
                    data-index="${index}" 
                    style="color: aqua; font-weight: bold; cursor: text;">
                    ${entry.name || 'UNNAMED'}
                </td>
                <td>
                    <button class="delete-btn" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        attachTableListeners();
    }
}

function attachTableListeners() {
    
    document.querySelectorAll('.edit-name').forEach(cell => {
        cell.addEventListener('blur', (e) => {
            const index = e.target.dataset.index;
            const newName = e.target.textContent.trim();
            
            let history = JSON.parse(localStorage.getItem('position_logs')) || [];
            if (history[index]) {
                history[index].name = newName;
                localStorage.setItem('position_logs', JSON.stringify(history));
                console.log(`Entry ${index} renamed to: ${newName}`);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            let history = JSON.parse(localStorage.getItem('position_logs')) || [];
            
            if (confirm("Permanently delete this location entry?")) {
                history.splice(index, 1); // Remove the specific item
                localStorage.setItem('position_logs', JSON.stringify(history));
                renderHistoryTable(); // Refresh the table
            }
        });
    });
}