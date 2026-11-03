// --- GLOBAL STATE ---
export let currentLat = null;
export let currentLon = null;
export let gpsTimestamp = null;
export let accuracy = null;
export let altitude = null;

const STORAGE_KEY = 'position_logs';

import { getLocation } from './locationEngine.js';

export async function loadLocStat({
    locationDisplayId = 'location',
    dateDisplayId = 'current-date',
    timeDisplayId = 'current-time',
    onReady = null,
} = {}) {
    const locationDisplay = document.getElementById(locationDisplayId);
    const dateDisplay = document.getElementById(dateDisplayId);
    const timeDisplay = document.getElementById(timeDisplayId);

    if (locationDisplay) {
        locationDisplay.textContent = 'Finding GPS COORDS for your location...';
    }

    try {
        const position = await getLocation();

        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        altitude = position.coords.altitude;
        accuracy = position.coords.accuracy;
        gpsTimestamp = new Date(position.timestamp);

        if (dateDisplay) {
            dateDisplay.textContent = `Date: ${gpsTimestamp.toLocaleDateString()}`;
        }

        if (timeDisplay) {
            timeDisplay.textContent = `Time: ${gpsTimestamp.toLocaleTimeString()}`;
        }

        const gpsCoords = `LAT: ${currentLat.toFixed(4)}, LON: ${currentLon.toFixed(4)}`;
        console.log(`Location obtained: ${gpsCoords}`);

        if (locationDisplay) {
            locationDisplay.textContent = `GPS COORDS: ${gpsCoords}`;
        }

        document.querySelectorAll('.coord-display').forEach(el => {
            el.textContent = gpsCoords;
        });

        if (typeof onReady === 'function') {
            onReady({ currentLat, currentLon, accuracy, altitude, gpsTimestamp });
        }

        return { currentLat, currentLon, accuracy, altitude, gpsTimestamp };
    } catch (error) {
        console.error('Error obtaining location:', error);
        if (locationDisplay) {
            locationDisplay.textContent = 'Unable to obtain GPS COORDS. Please allow location access and refresh the page.';
        }
        return null;
    }
}

export function saveLocStat() {
    if (currentLat === null || currentLon === null || gpsTimestamp === null) {
        console.warn('Cannot save: No GPS data in memory.');
        return false;
    }

    const entryName = prompt('Enter a name for this location:', 'My Location') || 'UNNAMED';
    const readableTime = `${gpsTimestamp.toLocaleDateString()} ${gpsTimestamp.toLocaleTimeString()}`;

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const newEntry = {
        timestamp: readableTime,
        lat: currentLat.toFixed(4),
        lon: currentLon.toFixed(4),
        accuracy: accuracy.toFixed(2),
        altitude: altitude ? altitude.toFixed(2) : 'N/A',
        name: entryName,
    };

    history.unshift(newEntry);
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    renderHistoryTable();
    return newEntry;
}

export async function copyLocStat() {
    const locationText = document.getElementById('location')?.textContent?.trim() || 'GPS COORDS: unavailable';
    const copyBtn = document.getElementById('copy-locstat');

    const textToCopy = locationText;

    try {
        await navigator.clipboard.writeText(textToCopy);
        const originalLabel = copyBtn?.textContent || 'COPY LOCSTAT';

        if (copyBtn) {
            copyBtn.textContent = 'COPIED';
            setTimeout(() => {
                copyBtn.textContent = originalLabel;
            }, 1200);
        }

        return textToCopy;
    } catch (error) {
        console.error('Failed to copy LOCSTAT:', error);

        if (copyBtn) {
            copyBtn.textContent = 'COPY FAILED';
            setTimeout(() => {
                copyBtn.textContent = 'COPY LOCSTAT';
            }, 1500);
        }

        return null;
    }
}

export function renderHistoryTable() {
    const tableBody = document.getElementById('position-data-rows');
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (!tableBody) {
        return history;
    }

    tableBody.innerHTML = history.map((entry, index) => `
        <tr>
            <td>${entry.timestamp}</td>
            <td>${entry.lat}</td>
            <td>${entry.lon}</td>
            <td>${entry.accuracy}</td>
            <td>${entry.altitude}</td>
            <td contenteditable="true"
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
    return history;
}

function attachTableListeners() {
    document.querySelectorAll('.edit-name').forEach(cell => {
        cell.addEventListener('blur', (event) => {
            const index = event.target.dataset.index;
            const newName = event.target.textContent.trim();
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            if (history[index]) {
                history[index].name = newName;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                console.log(`Entry ${index} renamed to: ${newName}`);
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = Number(event.currentTarget.dataset.index);
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            if (confirm('Permanently delete this location entry?')) {
                history.splice(index, 1);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                renderHistoryTable();
            }
        });
    });
}
