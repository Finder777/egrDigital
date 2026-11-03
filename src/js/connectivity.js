// Eds best attempt

export function updateCommsIntercept() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareDisplay = document.getElementById('hardware-type');
    const freqDisplay = document.getElementById('frequency');
    const downlinkDisplay = document.getElementById('downlink');
    const maxDownlinkCapacityDisplay = document.getElementById('max-downlink-capacity');
    const rttDisplay = document.getElementById('rtt');
    const saveDataDisplay = document.getElementById('save-data');
    const signalStrengthDisplay = document.getElementById('signal-strength');
    const signalQualityDisplay = document.getElementById('signal-quality');
    const signalTypeDisplay = document.getElementById('signal-type');
    const signalBarsEl = document.getElementById('signal-bars');
    const signalStatusEl = document.getElementById('signal-status');

    const hardware = connection?.type || connection?.effectiveType || 'UNAVAILABLE';
    const effectiveSpeed = connection?.effectiveType || 'UNKNOWN';
    const downlink = Number(connection?.downlink) || 0;
    const maxDownlinkCapacity = Number(connection?.downlinkMax) || 0;
    const rttValue = Number(connection?.rtt) || 0;
    const saveData = connection?.saveData ? 'ENABLED' : 'DISABLED';

    if (hardwareDisplay) {
        hardwareDisplay.textContent = hardware.toUpperCase();
        hardwareDisplay.style.color = connection ? '#00ff00' : '#ffaa00';
    }

    if (!connection) {
        if (freqDisplay) freqDisplay.textContent = 'UNAVAILABLE';
        if (downlinkDisplay) downlinkDisplay.textContent = '0 Mb/s';
        if (maxDownlinkCapacityDisplay) maxDownlinkCapacityDisplay.textContent = '0 Mb/s';
        if (rttDisplay) rttDisplay.textContent = '-- ms';
        if (saveDataDisplay) saveDataDisplay.textContent = 'UNKNOWN';
        if (signalStrengthDisplay) signalStrengthDisplay.textContent = 'UNKNOWN';
        if (signalQualityDisplay) signalQualityDisplay.textContent = 'UNKNOWN';
        if (signalTypeDisplay) signalTypeDisplay.textContent = 'UNKNOWN';

        if (signalBarsEl && signalStatusEl) {
            signalBarsEl.className = 'signal-bars';
            signalBarsEl.classList.add('level-1');
            signalStatusEl.textContent = 'API UNAVAILABLE';
        }
        return;
    }

    if (freqDisplay) freqDisplay.textContent = effectiveSpeed.toUpperCase();
    if (downlinkDisplay) downlinkDisplay.textContent = `${downlink} Mb/s`;
    if (maxDownlinkCapacityDisplay) maxDownlinkCapacityDisplay.textContent = `${maxDownlinkCapacity || downlink} Mb/s`;
    if (rttDisplay) rttDisplay.textContent = `${connection.rtt ?? '--'} ms`;
    if (saveDataDisplay) saveDataDisplay.textContent = saveData;

    let signalStrength = 0;
    let signalQuality = 'UNKNOWN';

    if (rttValue === 0 || connection.rtt == null) {
        signalStrength = 0;
        signalQuality = 'UNKNOWN';
    } else if (rttValue < 70) {
        signalStrength = 98;
        signalQuality = 'EXCELLENT';
    } else if (rttValue < 150) {
        signalStrength = 78;
        signalQuality = 'GOOD';
    } else if (rttValue < 300) {
        signalStrength = 56;
        signalQuality = 'FAIR';
    } else {
        signalStrength = 30;
        signalQuality = 'POOR';
    }

    if (signalStrengthDisplay) signalStrengthDisplay.textContent = `${signalStrength}%`;
    if (signalQualityDisplay) signalQualityDisplay.textContent = signalQuality;
    if (signalTypeDisplay) signalTypeDisplay.textContent = effectiveSpeed.toUpperCase();

    if (signalBarsEl && signalStatusEl) {
        signalBarsEl.className = 'signal-bars';

        if (rttValue === 0 || connection.rtt == null) {
            signalStatusEl.textContent = 'NO TELEMETRY';
        } else if (rttValue < 70) {
            signalBarsEl.classList.add('level-4');
            signalStatusEl.textContent = 'EXCELLENT (LOW RTT)';
        } else if (rttValue < 150) {
            signalBarsEl.classList.add('level-3');
            signalStatusEl.textContent = 'WORKABLE (MODERATE RTT)';
        } else if (rttValue < 300) {
            signalBarsEl.classList.add('level-2');
            signalStatusEl.textContent = 'DEGRADED';
        } else {
            signalBarsEl.classList.add('level-1');
            signalStatusEl.textContent = 'HIGH LATENCY';
        }
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateCommsIntercept);
    window.addEventListener('load', updateCommsIntercept);
}

if (navigator.connection) {
    navigator.connection.addEventListener('change', updateCommsIntercept);
}