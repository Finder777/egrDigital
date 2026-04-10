let map = null;
let userMarker = null;

export function initLeafletMap(currentLat, currentLon) {
    if (!map) {
        map = L.map('map').setView([currentLat, currentLon], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(map);

        userMarker = L.circleMarker([currentLat, currentLon], {
            radius: 8,
            fillColor: "#00ff00", 
            color: "#fff",
            weight: 2,
            fillOpacity: 1
        }).addTo(map);
    } else {
        userMarker.setLatLng([currentLat, currentLon]);
        map.panTo([currentLat, currentLon]);
    }
}