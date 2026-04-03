// --- GLOBAL VARIABLES for everything else to use ---
export let currentLat = null;
export let currentLon = null;

export async function acquireGPS() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Hardware not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                console.log(`LOCATION SECURED: ${currentLat}, ${currentLon}`);
                resolve({ lat: currentLat, lon: currentLon });
            },
            (error) => reject(error),
            { enableHighAccuracy: true }
        );
    });
}