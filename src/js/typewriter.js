async function typeLine(el, speed) {
    return new Promise((resolve) => {
        
        const fullText = el.textContent.trim();
        if (!fullText) return resolve();

        if (el.dataset.isTyping === "true") return resolve(); 
        el.dataset.isTyping = "true";
        el.textContent = '';

        let i = 0;

        const interval = setInterval(() => {
            if (i < fullText.length) {
                el.textContent += fullText.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                el.dataset.isTyping = "false";
                resolve();
            }
        }, speed);
    });
}

export async function startTypewriter(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lines = container.querySelectorAll('span');

    for (const line of lines) {
        
        await typeLine(line, 100); 
    }
}
;