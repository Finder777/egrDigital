// --- WEATHER ENGINE ---
export function interpretWeatherCode(code) {
    if (code === 0) return "CLEAR SKIES";
    if (code <= 3) return "PARTIAL CLOUD";
    if (code >= 45 && code <= 48) return "FOG / MIST";
    if (code >= 51) return "PRECIPITATION DETECTED";
    return "ANALYZING...";
}

export async function updateWeather(lat, lon) {
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