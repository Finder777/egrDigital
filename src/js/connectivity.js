// Eds best attempt

export function updateCommsIntercept() {
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