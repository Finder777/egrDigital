// mapping.js this should take care of the map once gps coords are available.

let map;
let userMarker;

export function initLeafletMap(lat, lon) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    if (!map) {
        // Initialise Map Instance
        map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(map);

        // Green "Position Secure" Marker
        userMarker = L.circleMarker([lat, lon], {
            radius: 8,
            fillColor: "#00ff00", 
            color: "#fff",
            weight: 2,
            fillOpacity: 1
        }).addTo(map);
        
        console.log("MAP: TACTICAL OVERLAY INITIALISED");
    } else {
        // Update existing instance
        userMarker.setLatLng([lat, lon]);
        map.panTo([lat, lon]);
    }
}

//UI FALLBACK: Displays error states if location.js fails.

export function setMapError(message) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    mapElement.classList.add('location-disabled');
    mapElement.innerHTML = `
        <div class="alert">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>SIGNAL ERROR: ${message}</p>
        </div>
    `;
}