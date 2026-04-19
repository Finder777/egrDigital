import { loadLocStat } from '/js/page.js';

async function typeLine(el, speed) {
    return new Promise((resolve) => {
        // 1. Grab the text that page.js just put there
        const fullText = el.textContent.trim();
        if (!fullText) return resolve();

        // 2. Clear ONLY the text, leaving the <span> and its class intact
        el.textContent = ''; 
        let i = 0;

        const interval = setInterval(() => {
            if (i < fullText.length) {
                el.textContent += fullText.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

async function startTypewriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 3. Find every span that already exists in your HTML
    const lines = container.querySelectorAll('span');

    for (const line of lines) {
        // This preserves the .heading or #id styles
        await typeLine(line, 275); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadLocStat().then(() => {
        // Target the parent div containing your spans
        startTypewriter('analytics');
    });
});