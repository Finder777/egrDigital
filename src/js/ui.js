// --- INITIALIZE UI SYSTEMS ---

document.addEventListener('DOMContentLoaded', () => {

    const exploreBtn = document.querySelector('a[href="#explore"]');
    const modalSection = document.getElementById('explore');
    const closeBtn = document.getElementById('closeModal');

    exploreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modalSection?.classList.add('show');
    });

    closeBtn?.addEventListener('click', () => modalSection?.classList.remove('show'));

    const toggleBtn = document.getElementById('hero-toggle');
    const hero = document.getElementById('hero-section');
    const icon = toggleBtn?.querySelector('i');

    toggleBtn?.addEventListener('click', () => {
        const isCollapsed = hero?.classList.toggle('collapsed');
        if (icon) {
            icon.classList.toggle('fa-window-minimize', !isCollapsed);
            icon.classList.toggle('fa-window-restore', isCollapsed);
        }
    });

    const mapToggleBtn = document.getElementById('map-toggle');
    const mapPanel = document.getElementById('dashboard-map');
    const mapIcon = mapToggleBtn?.querySelector('i');

    mapToggleBtn?.addEventListener('click', () => {
        const isCollapsed = mapPanel?.classList.toggle('collapsed');
        mapToggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
        mapToggleBtn.setAttribute('aria-label', isCollapsed ? 'Restore map' : 'Minimize map');
        mapToggleBtn.title = isCollapsed ? 'Restore map' : 'Minimize map';

        if (mapIcon) {
            mapIcon.classList.toggle('fa-window-minimize', !isCollapsed);
            mapIcon.classList.toggle('fa-window-restore', isCollapsed);
        }
    });

    const menuIcon = document.getElementById('menuIcon');
    const menuSection = document.querySelector('.menu-content');
    const closeMenu = document.getElementById('closeMenu');

    menuIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        menuSection?.classList.add('show');
    });

    closeMenu?.addEventListener('click', () => {
        menuSection?.classList.remove('show');
    });

});