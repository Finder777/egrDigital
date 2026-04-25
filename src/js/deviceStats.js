// System Meta-Data

export function deviceStats() {
    const timezoneDisplayElement = document.getElementById('timezone');
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezoneDisplayElement) timezoneDisplayElement.textContent = `Timezone: ${userTimezone}`;

    const browserLanguage = navigator.language;
    const settingsLanguage = document.getElementById('language');
        if (settingsLanguage) settingsLanguage.textContent = `Language: ${browserLanguage}`;

    const screenWidthElement = document.getElementById('screen-width');
        if (screenWidthElement) screenWidthElement.textContent = `Screen Width: ${window.screen.width}`;
        
    const screenHeightElement = document.getElementById('screen-height');
        if (screenHeightElement) screenHeightElement.textContent = `Screen Height: ${window.screen.height}`;
        
    const userAgentElement = document.getElementById('user-agent');
        if (userAgentElement) userAgentElement.textContent = `User Agent: ${navigator.userAgent}`;
}