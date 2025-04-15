// assets/js/home.js
import ApiService from './api.js';
import AppState from './state-manager.js';

// Elementos da UI
const UI = {
    postsContainer: document.getElementById('postsContainer'),
    storiesContainer: document.getElementById('storiesList'),
    postModal: document.getElementById('postModal'),
    storyModal: document.getElementById('storyModal'),
    newPostBtn: document.getElementById('newPostBtn'),
    newStoryBtn: document.getElementById('newStoryBtn'),
    postForm: document.getElementById('postForm'),
    storyForm: document.getElementById('storyForm'),
    postImageInput: document.getElementById('postImage'),
    storyImageInput: document.getElementById('storyImage'),
    imagePreview: document.getElementById('imagePreview'),
    mediaPreview: document.getElementById('mediaPreview')
};

// Estado da UI
const uiState = {
    currentUser: null,
    isLoading: false
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    initEventListeners();
    await loadData();
});

// Verifica autenticação
async function checkAuth() {
    uiState.currentUser = AppState.getUser();
    if (!uiState.currentUser) {
        window.location.href = '../index.html';
        return;
    }
}

// Configura event listeners
function initEventListeners() {
    // Botões de novo conteúdo
    UI.newPostBtn.addEventListener('click', () => showModal(UI.postModal));
    UI.newStoryBtn.addEventListener('click', () => showModal(UI.storyModal));

    // Fechar modais
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            UI.postModal.style.display = 'none';
            UI.storyModal.style.display = 'none';
        });
    });

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === UI.postModal) UI.postModal.style.display = 'none';
        if (e.target === UI.storyModal) UI.storyModal.style.display = 'none';
    });

    // Formulários
    UI.postForm.addEventListener('submit', handlePostSubmit);
    UI.storyForm.addEventListener('submit', handleStorySubmit);

    // Preview de imagens
    UI.postImageInput.addEventListener('change', (e) => handleFileSelect(e, UI.imagePreview));
    UI.storyImageInput.addEventListener('change', (e) => handleFileSelect(e, UI.mediaPreview));
}

// Carrega posts e stories
async function loadData() {
    try {
        setLoading(true);
        
        const [posts, stories] = await Promise.all([
            ApiService.getPosts(),
            ApiService.getStories()
        ]);

        AppState.setPosts(posts);
        AppState.setStories(stories);
        
        renderPosts();
        renderStories();
        setupStoriesNavigation();
    } catch (error) {
        showError('Erro ao carregar dados: ' + error.message);
    } finally {
        setLoading(false);
    }
}

// Renderiza posts
function renderPosts() {
    const posts = AppState.getPosts();
    UI.postsContainer.innerHTML = '';

    if (posts.length === 0) {
        UI.postsContainer.innerHTML = '<div class="empty-state">Nenhum post encontrado</div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        UI.postsContainer.appendChild(postElement);
    });
}

// Cria elemento de post
function createPostElement(post) {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.dataset.id = post.id;

    const isLiked = post.likes?.includes(uiState.currentUser.id) || false;
    const likeIcon = isLiked ? 'fas fa-heart' : 'far fa-heart';
    const likeColor = isLiked ? 'style="color: var(--error-color)"' : '';

    postEl.innerHTML = `
        <div class="post-header">
            <div class="post-user">
                <img src="${post.user?.imagemPerfil || 'https://via.placeholder.com/150'}" class="post-avatar">
                <span class="post-username">${post.user?.nome || 'Usuário'}</span>
            </div>
            <i class="fas fa-ellipsis-h"></i>
        </div>
        <img src="${post.imagem}" alt="Post" class="post-image">
        <div class="post-actions">
            <div>
                <i class="${likeIcon} like-btn" data-post-id="${post.id}" ${likeColor}></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <i class="far fa-bookmark"></i>
        </div>
        <div class="post-likes">${post.likes?.length || 0} curtidas</div>
        <div class="post-caption">
            <span>${post.user?.nome || 'Usuário'}</span>
            ${post.descricao || ''}
        </div>
        <div class="post-comments">Ver todos os comentários</div>
        <div class="post-time">${formatDate(post.dataPublicacao)}</div>
        <div class="post-comment-form">
            <input type="text" placeholder="Adicione um comentário..." class="post-comment-input">
            <button class="post-comment-button">Publicar</button>
        </div>
    `;

    // Evento de like
    postEl.querySelector('.like-btn').addEventListener('click', () => handleLikePost(post.id));

    return postEl;
}

// Renderiza stories
function renderStories() {
    const stories = AppState.getStories();
    UI.storiesContainer.innerHTML = '';

    if (stories.length === 0) {
        UI.storiesContainer.innerHTML = '<div class="empty-state">Nenhum story disponível</div>';
        return;
    }

    stories.forEach(story => {
        const storyElement = createStoryElement(story);
        UI.storiesContainer.appendChild(storyElement);
    });
}

// Cria elemento de story
function createStoryElement(story) {
    const storyEl = document.createElement('div');
    storyEl.className = 'story';

    storyEl.innerHTML = `
        <div class="story-avatar">
            <img src="${story.user?.imagemPerfil || 'https://via.placeholder.com/150'}">
        </div>
        <div class="story-username">${story.user?.nome || 'Usuário'}</div>
    `;

    return storyEl;
}

// Configura navegação de stories
function setupStoriesNavigation() {
    const storiesElement = document.querySelector('.stories');
    const prevBtn = document.querySelector('.stories-nav.prev');
    const nextBtn = document.querySelector('.stories-nav.next');

    const updateNavButtons = () => {
        prevBtn.style.display = storiesElement.scrollLeft > 0 ? 'flex' : 'none';
        nextBtn.style.display = storiesElement.scrollLeft < storiesElement.scrollWidth - storiesElement.clientWidth ? 'flex' : 'none';
    };

    storiesElement.addEventListener('scroll', updateNavButtons);
    updateNavButtons();

    prevBtn.addEventListener('click', () => {
        storiesElement.scrollBy({ left: -200, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        storiesElement.scrollBy({ left: 200, behavior: 'smooth' });
    });
}

// Manipula like em post
async function handleLikePost(postId) {
    try {
        const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
        likeBtn.classList.toggle('far');
        likeBtn.classList.toggle('fas');
        
        const isLiked = likeBtn.classList.contains('fas');
        likeBtn.style.color = isLiked ? 'var(--error-color)' : '';
        
        await ApiService.likePost(postId, uiState.currentUser.id);
        await loadData(); // Recarrega os dados para atualizar contagem
    } catch (error) {
        showError('Erro ao curtir post: ' + error.message);
    }
}

// Manipula envio de post
async function handlePostSubmit(e) {
    e.preventDefault();
    const submitBtn = UI.postForm.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner');
    const buttonText = submitBtn.querySelector('#postButtonText');
    
    try {
        // Mostra spinner e desabilita botão
        buttonText.textContent = 'Publicando...';
        spinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        const formData = new FormData(UI.postForm);
        const description = formData.get('postDesc');
        const location = formData.get('postLocation');
        const imageFile = UI.postImageInput.files[0];
        
        if (!imageFile) {
            throw new Error('Selecione uma imagem');
        }
        
        // Upload da imagem
        const uploadResponse = await ApiService.uploadFile(imageFile);
        
        // Cria o post
        const postData = {
            descricao: description,
            local: location || null,
            imagem: uploadResponse.url,
            idUsuario: uiState.currentUser.id
        };
        
        await ApiService.createPost(postData);
        await loadData(); // Recarrega os posts
        
        // Fecha modal e limpa formulário
        UI.postModal.style.display = 'none';
        UI.postForm.reset();
        UI.imagePreview.style.display = 'none';
        UI.imagePreview.innerHTML = '';
    } catch (error) {
        showError('Erro ao criar post: ' + error.message);
    } finally {
        // Restaura botão
        buttonText.textContent = 'Publicar';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Manipula envio de story
async function handleStorySubmit(e) {
    e.preventDefault();
    const submitBtn = UI.storyForm.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner');
    const buttonText = submitBtn.querySelector('#storyButtonText');
    
    try {
        // Mostra spinner e desabilita botão
        buttonText.textContent = 'Publicando...';
        spinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        const formData = new FormData(UI.storyForm);
        const description = formData.get('storyDesc');
        const mediaFile = UI.storyImageInput.files[0];
        
        if (!mediaFile) {
            throw new Error('Selecione uma mídia');
        }
        
        // Upload da mídia
        const uploadResponse = await ApiService.uploadFile(mediaFile);
        
        // Cria o story
        const storyData = {
            descricao: description || null,
            imagem: uploadResponse.url,
            idUsuario: uiState.currentUser.id
        };
        
        await ApiService.createStory(storyData);
        await loadData(); // Recarrega os stories
        
        // Fecha modal e limpa formulário
        UI.storyModal.style.display = 'none';
        UI.storyForm.reset();
        UI.mediaPreview.style.display = 'none';
        UI.mediaPreview.innerHTML = '';
    } catch (error) {
        showError('Erro ao criar story: ' + error.message);
    } finally {
        // Restaura botão
        buttonText.textContent = 'Publicar Story';
        spinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Mostra preview de arquivo selecionado
function handleFileSelect(event, previewElement) {
    const file = event.target.files[0];
    if (!file) return;

    previewElement.innerHTML = '';
    previewElement.style.display = 'block';

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        previewElement.appendChild(img);
    } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        previewElement.appendChild(video);
    }
}

// Mostra modal
function showModal(modal) {
    modal.style.display = 'flex';
}

// Mostra erro
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Adiciona temporariamente na página
    document.body.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Formata data
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Controla estado de loading
function setLoading(isLoading) {
    uiState.isLoading = isLoading;
    document.body.style.cursor = isLoading ? 'wait' : 'default';
}