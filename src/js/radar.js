const RANGE_MILES = 50;
const AZURE_FUNCTION_URL = 'https://orbit-bbd0a7b8hqcvfheu.uksouth-01.azurewebsites.net/api/aircraft';

export async function updateAirspace(userLat, userLon) {
    const radar = document.getElementById('radar-display');
    const tableBody = document.getElementById('flight-data-rows');
    
    // Update the coordinate display in the AIRSPACE section
    const coordDisplays = document.querySelectorAll('.airtracker .coord-display');
    coordDisplays.forEach(display => {
        display.textContent = `${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;
    });

    if (!radar || !tableBody) return;

    // 1. Clear previous visual data (removes existing .aircraft-blip divs)
    radar.querySelectorAll('.aircraft-blip').forEach(b => b.remove());
    tableBody.innerHTML = ''; 

    try {
        // 2. Fetch from your Azure Middleware
        const response = await fetch(AZURE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude: userLat,
                longitude: userLon
            })
        });

        if (!response.ok) throw new Error(`Middleware error: ${response.status}`);

        const data = await response.json();

        // 3. Process the 'aircraft' array from the Azure Function response
        if (data.aircraft && Array.isArray(data.aircraft)) {
            const radarWidth = radar.offsetWidth;
            const center = radarWidth / 2;

            data.aircraft.forEach(flight => {
                // OpenSky State Vector indices
                const [icao, callsign, country, time, lastPos, lon, lat, alt, onGround, velocity, track, verticalRate] = flight;
                
                // 4. Distance and Plotting Math
                const xDist = (lon - userLon) * (69 * Math.cos(userLat * Math.PI / 180));
                const yDist = (lat - userLat) * 69;
                const totalDist = Math.sqrt(xDist * xDist + yDist * yDist);

                // Filter to the 50mi radar limit
                if (totalDist <= RANGE_MILES) {
                    
                    // --- DRAW RADAR BLIP ---
                    const blip = document.createElement('div');
                    blip.className = 'aircraft-blip';
                    
                    const pixelsPerMile = center / RANGE_MILES;
                    const xPx = center + (xDist * pixelsPerMile);
                    const yPx = center - (yDist * pixelsPerMile);

                    blip.style.left = `${xPx}px`;
                    blip.style.top = `${yPx}px`;
                    // Optional: Add a title for hover effects
                    blip.title = callsign ? callsign.trim() : icao.toUpperCase();
                    radar.appendChild(blip);

                    // --- ADD TABLE ROW ---
                    const altFt = alt ? Math.round(alt * 3.28084) : '---';
                    const speedKts = velocity ? Math.round(velocity * 1.94384) : '0';
                    const heading = track ? Math.round(track) + '°' : '---';

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${icao.toUpperCase()}</td>
                        <td>${country}</td>
                        <td>${callsign ? callsign.trim() : icao.toUpperCase()}</td>
                        <td>${altFt.toLocaleString()}</td>
                        <td>${speedKts}</td>
                        <td>${heading}</td>
                        <td>${verticalRate ? Math.round(verticalRate * 196.8504) + ' ft/min' : '---'}</td>
                    `;
                    tableBody.appendChild(row);
                }
            });
        }
    } catch (err) {
        console.error("AIRSPACE intercept failed:", err);
    }
}