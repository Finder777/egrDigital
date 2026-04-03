// --- SYSTEM META-DATA & TIME ---
export function loadSystemData() {
    const now = new Date();
    
    // Update Time/Date
    document.getElementById('current-date')?.textContent = `Date: ${now.toDateString()}`;
    document.getElementById('current-time')?.textContent = `Time: ${now.toLocaleTimeString()}`;

    // Update Hardware Info
    document.getElementById('timezone')?.textContent = `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    document.getElementById('screen-width')?.textContent = `Screen Width: ${window.screen.width}`;
    document.getElementById('user-agent')?.textContent = `User Agent: ${navigator.userAgent}`;
    
    console.log("SYSTEM: META-DATA LOGGED");
}