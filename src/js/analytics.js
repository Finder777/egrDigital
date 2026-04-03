// --- GLOBAL STATE & IMPORTS ---
export let currentLat = null;
export let currentLon = null;
import { updateAirspace } from './radar.js';

// --- WEATHER ENGINE ---
function interpretWeatherCode(code) {
    if (code === 0) return "CLEAR SKIES";
    if (code <= 3) return "PARTIAL CLOUD";
    if (code >= 45 && code <= 48) return "FOG / MIST";
    if (code >= 51) return "PRECIPITATION DETECTED";
    return "ANALYZING...";
}

async function updateWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=temperature_2m_max,weather_code&hourly=shortwave_radiation,visibility,cloud_cover,precipitation&precipitation_unit=mm&timezone=auto`);
        const data = await response.json();
        
        const airTemp = data.current.temperature_2m;
        const maxTemp = data.daily.temperature_2m_max[0];
        const code = data.daily.weather_code[0];
        const summary = interpretWeatherCode(code);
        const solar = data.hourly.shortwave_radiation[0];
        const visibility = data.hourly.visibility[0];
        const cloud = data.hourly.cloud_cover[0];
        
        // Update UI Elements
        const weatherDisplay = document.getElementById('weather-summary');
        if (weatherDisplay) weatherDisplay.textContent = `Summary: ${summary}`;
        
        const airTempDisplay = document.getElementById('airTemp');
        if (airTempDisplay) airTempDisplay.textContent = `Current Air Temp: ${airTemp}°C`;
        
        const tempDisplay = document.getElementById('maxTemp');
        if (tempDisplay) tempDisplay.textContent = `Max Air Temp: ${maxTemp}°C`;

        const cloudCover = document.getElementById('cloud-cover');
        if (cloudCover) cloudCover.textContent = `Cloud Cover: ${cloud}%`;

        const visibilityDisplay = document.getElementById('visibility');
        if (visibilityDisplay) visibilityDisplay.textContent = `Visibility: ${visibility}m`;

        const solarDisplay = document.getElementById('solar-energy');
        if (solarDisplay) solarDisplay.textContent = `Solar Radiation: ${solar} W/m²`;

    } catch (error) {
        console.error("Weather sync failed", error);
    }
}

// --- MAPPING ENGINE ---
let map;
let userMarker;

function requestLocation() {
    const mapElement = document.getElementById('map');

    if (!navigator.geolocation) {
        mapElement.innerHTML = "<p>CRITICAL: GEOLOCATION NOT SUPPORTED BY HARDWARE</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // SUCCESS: Clear any error messages and init map
            mapElement.classList.remove('location-disabled');
            initLeafletMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
            // FAILURE: User denied or location is off
            mapElement.classList.add('location-disabled');
            
            if (error.code === error.PERMISSION_DENIED) {
                mapElement.innerHTML = `
                    <div class="alert">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>SIGNAL LOST: CHECK LOCATION SETTINGS</p>
                        <small>Permissions must be granted for Tactical Mapping.</small>
                    </div>
                `;
            } else {
                mapElement.innerHTML = "<p>SIGNAL INTERFERENCE: UNABLE TO FIX COORDINATES</p>";
            }
        }
    );
}

function initLeafletMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(map);

        userMarker = L.circleMarker([lat, lon], {
            radius: 8,
            fillColor: "#00ff00", 
            color: "#fff",
            weight: 2,
            fillOpacity: 1
        }).addTo(map);
    } else {
        userMarker.setLatLng([lat, lon]);
        map.panTo([lat, lon]);
    }
}

// Start the sequence
requestLocation();

// --- CENTRAL ANALYTICS ENGINE ---
export function loadAnalyticsData() {
    return new Promise((resolve) => {

        // 1. Time & Date Logic
        const now = new Date();
        const dateElement = document.getElementById('current-date');
        if (dateElement) dateElement.textContent = `Date: ${now.toDateString()}`;

        const yearElement = document.getElementById('current-year');
        if (yearElement) yearElement.textContent = now.getFullYear().toString();

        const timeElement = document.getElementById('current-time');
        if (timeElement) timeElement.textContent = `Time: ${now.toLocaleTimeString()}`;

        // 2. Geolocation Logic
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
                // FIX: Update the exported global variables
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;

                updateLocationDisplay(`${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`);
                
                // Update all section badges with the class .coord-display
                document.querySelectorAll('.coord-display').forEach(el => {
                    el.textContent = `${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}`;
                });

                // Initialize/Update Map
                if (typeof initLeafletMap === "function") {
                    initLeafletMap(currentLat, currentLon);
                }

                // Update Weather
                if (typeof updateWeather === "function") {
                    updateWeather(currentLat, currentLon);
                }

                // Update Radar
                updateAirspace(currentLat, currentLon);

                console.log("Geolocation: Central Engine Success");
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

        // 3. System Meta-Data
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

// --- UI EVENT LISTENERS ---
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