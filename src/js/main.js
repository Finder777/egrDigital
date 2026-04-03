// main.js
import { loadSystemData } from './metadata.js';
import { startTypewriter } from './typewriter.js';
import { acquireGPS } from './location.js';
import { updateWeather } from './weather.js';

async function bootDashboard() {
    loadSystemData(); 
    startTypewriter('analytics');

    try {
        
        const coords = await acquireGPS();

        updateWeather(coords.lat, coords.lon);
        
        
    } catch (err) {
        console.error("GPS Unavailable. Interface running on static data.");
        signalError("GPS OFFLINE- CHECK LOCATION SETTINGS");
    }
}

document.addEventListener('DOMContentLoaded', bootDashboard);