// assets/js/settings.js
import AppState from './state-manager.js';

const menuBurger = document.getElementById('menuBurger');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const darkModeToggle = document.getElementById('darkModeToggle');
const logoutBtn = document.getElementById('logoutBtn');

// Abre/fecha o menu de configurações
menuBurger.addEventListener('click', () => {
    sideMenu.classList.add('open');
});

closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('open');
});

// Alterna o tema escuro
darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    
    // Atualiza o estado do toggle
    const toggleSwitch = darkModeToggle.querySelector('.toggle-switch');
    const toggleKnob = darkModeToggle.querySelector('.toggle-knob');
    
    if (document.body.classList.contains('dark-mode')) {
        toggleSwitch.style.backgroundColor = '#53136C';
        toggleKnob.style.transform = 'translateX(20px)';
    } else {
        toggleSwitch.style.backgroundColor = '#ccc';
        toggleKnob.style.transform = 'translateX(0)';
    }
});

// Verifica o tema ao carregar a página
function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const toggleSwitch = darkModeToggle.querySelector('.toggle-switch');
        const toggleKnob = darkModeToggle.querySelector('.toggle-knob');
        toggleSwitch.style.backgroundColor = '#53136C';
        toggleKnob.style.transform = 'translateX(20px)';
    }
}

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    AppState.clearAuth();
    window.location.href = '../index.html';
});

// Inicializa
checkDarkMode();