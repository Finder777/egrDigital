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

    const rtt = connection.rtt || 0;
    const signalBarsEl = document.getElementById('signal-bars');
    const signalStatusEl = document.getElementById('signal-status');

    if (signalBarsEl && signalStatusEl) {
        // Reset classes
        signalBarsEl.className = 'signal-bars';
        
        if (rtt === 0 || rtt === '--') {
            signalStatusEl.textContent = 'NO TELEMETRY';
        } else if (rtt < 70) {
            signalBarsEl.classList.add('level-4');
            signalStatusEl.textContent = 'EXCELLENT (LOW RTT)';
        } else if (rtt < 150) {
            signalBarsEl.classList.add('level-3');
            signalStatusEl.textContent = 'NOMINAL';
        } else if (rtt < 300) {
            signalBarsEl.classList.add('level-2');
            signalStatusEl.textContent = 'DEGRADED';
        } else {
            signalBarsEl.classList.add('level-1');
            signalStatusEl.textContent = 'HIGH LATENCY';
        }
    }
}

window.addEventListener('load', updateCommsIntercept);

if (navigator.connection) {
    navigator.connection.addEventListener('change', updateCommsIntercept);
}