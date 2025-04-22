// assets/js/stories.js
import ApiService from './api.js';
import AppState from './state-manager.js';

const storiesList = document.getElementById('storiesList');
const prevBtn = document.querySelector('.stories-nav.prev');
const nextBtn = document.querySelector('.stories-nav.next');

// Carrega os stories
export async function loadStories() {
    try {
        const stories = await ApiService.getStories();
        AppState.setStories(stories);
        renderStories(stories);
    } catch (error) {
        console.error('Error loading stories:', error);
    }
}

// Renderiza os stories
function renderStories(stories) {
    storiesList.innerHTML = '';
    
    // Adiciona o story do usuário primeiro (para criar novo)
    const user = AppState.getUser();
    if (user) {
        const userStory = document.createElement('div');
        userStory.className = 'story user-story';
        userStory.innerHTML = `
            <div class="story-avatar">
                <img src="${user.imagemPerfil || 'https://via.placeholder.com/150'}">
                <div class="add-icon">+</div>
            </div>
            <div class="story-username">Seu Story</div>
        `;
        userStory.addEventListener('click', () => {
            document.getElementById('storyModal').style.display = 'flex';
        });
        storiesList.appendChild(userStory);
    }
    
    // Adiciona os stories de outros usuários
    stories.forEach(story => {
        const storyElement = createStoryElement(story);
        storiesList.appendChild(storyElement);
    });
    
    setupStoriesNavigation();
}

// Cria elemento de story
function createStoryElement(story) {
    const element = document.createElement('div');
    element.className = 'story';
    element.innerHTML = `
        <div class="story-avatar">
            <img src="${story.user?.imagemPerfil || 'https://via.placeholder.com/150'}">
        </div>
        <div class="story-username">${story.user?.nome || 'Usuário'}</div>
    `;
    
    element.addEventListener('click', () => {
        openStoryViewer(story);
    });
    
    return element;
}

// Abre o visualizador de story
function openStoryViewer(story) {
    // Aqui você implementaria um visualizador de stories completo
    // Por enquanto, vamos apenas mostrar uma prévia
    alert(`Visualizando story de ${story.user?.nome || 'Usuário'}`);
}

// Configura navegação dos stories
function setupStoriesNavigation() {
    const storiesElement = document.querySelector('.stories');
    
    prevBtn.addEventListener('click', () => {
        storiesElement.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        storiesElement.scrollBy({ left: 200, behavior: 'smooth' });
    });
    
    // Atualiza a visibilidade dos botões
    storiesElement.addEventListener('scroll', () => {
        prevBtn.style.display = storiesElement.scrollLeft > 0 ? 'flex' : 'none';
        nextBtn.style.display = storiesElement.scrollLeft < 
            (storiesElement.scrollWidth - storiesElement.clientWidth) ? 'flex' : 'none';
    });
    
    // Verifica inicialmente
    prevBtn.style.display = 'none';
    nextBtn.style.display = storiesElement.scrollWidth > storiesElement.clientWidth ? 'flex' : 'none';
}