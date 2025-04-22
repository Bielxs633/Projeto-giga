// assets/js/perfil.js
import ApiService from './api.js';
import AppState from './state-manager.js';

const profileContent = document.querySelector('.profile-content');
const profilePosts = document.getElementById('profilePosts');
const savedPosts = document.getElementById('savedPosts');
const taggedPosts = document.getElementById('taggedPosts');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Elementos do cabeçalho do perfil
const profileUsername = document.getElementById('profileUsername');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');
const postCount = document.getElementById('postCount');
const followerCount = document.getElementById('followerCount');
const followingCount = document.getElementById('followingCount');

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    initEventListeners();
    await loadProfileData();
});

// Verifica autenticação
async function checkAuth() {
    const user = AppState.getUser();
    if (!user) {
        window.location.href = '../../index.html';
        return;
    }
}

// Configura event listeners
function initEventListeners() {
    // Tabs do perfil
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Atualiza tabs ativas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => {
                content.style.display = content.id === `${tabName}Tab` ? 'block' : 'none';
            });
            
            // Carrega conteúdo se necessário
            if (tabName === 'saved' && savedPosts.children.length === 0) {
                loadSavedPosts();
            } else if (tabName === 'tagged' && taggedPosts.children.length === 0) {
                loadTaggedPosts();
            }
        });
    });
}

// Carrega dados do perfil
async function loadProfileData() {
    try {
        // Obtém o ID do usuário da URL ou usa o usuário logado
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user') || AppState.getUser().id;
        
        // Carrega dados do usuário
        const user = await ApiService.getProfile(userId);
        
        // Atualiza a UI
        updateProfileUI(user);
        
        // Carrega posts do usuário
        await loadUserPosts(userId);
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Erro ao carregar perfil');
    }
}

// Atualiza a UI do perfil
function updateProfileUI(user) {
    profileUsername.textContent = user.nome || 'Usuário';
    profileName.textContent = user.nome || 'Usuário';
    profileBio.textContent = user.bio || 'Sem biografia';
    
    // Estatísticas (simuladas - você precisaria desses dados da API)
    postCount.textContent = '28';
    followerCount.textContent = '1.2K';
    followingCount.textContent = '356';
    
    // Verifica se é o perfil do usuário logado
    const currentUser = AppState.getUser();
    const isOwnProfile = currentUser && currentUser.id === user.id;
    
    const editProfileBtn = document.querySelector('.edit-profile');
    if (isOwnProfile) {
        editProfileBtn.textContent = 'Editar Perfil';
        editProfileBtn.addEventListener('click', () => {
            // Implemente a edição do perfil aqui
            alert('Editar perfil');
        });
    } else {
        editProfileBtn.textContent = 'Seguir';
        editProfileBtn.classList.add('follow-btn');
        editProfileBtn.addEventListener('click', () => {
            // Implemente seguir usuário aqui
            toggleFollowUser(user.id);
        });
    }
}

// Carrega posts do usuário
async function loadUserPosts(userId) {
    try {
        // Aqui você buscaria os posts do usuário na API
        // const posts = await ApiService.getUserPosts(userId);
        
        // Simulando dados
        const posts = AppState.getPosts().filter(post => post.idUsuario === userId);
        
        if (posts.length === 0) {
            profilePosts.innerHTML = '<div class="empty-state">Nenhuma publicação ainda</div>';
            return;
        }
        
        renderPosts(posts, profilePosts);
    } catch (error) {
        console.error('Error loading user posts:', error);
        profilePosts.innerHTML = '<div class="error-state">Erro ao carregar publicações</div>';
    }
}

// Carrega posts salvos
async function loadSavedPosts() {
    try {
        // Aqui você buscaria os posts salvos na API
        // const saved = await ApiService.getSavedPosts(AppState.getUser().id);
        
        // Simulando dados
        const saved = AppState.getPosts().slice(0, 3); // Exemplo
        
        if (saved.length === 0) {
            savedPosts.innerHTML = '<div class="empty-state">Nenhum post salvo</div>';
            return;
        }
        
        renderPosts(saved, savedPosts, true);
    } catch (error) {
        console.error('Error loading saved posts:', error);
        savedPosts.innerHTML = '<div class="error-state">Erro ao carregar salvos</div>';
    }
}

// Carrega posts marcados
async function loadTaggedPosts() {
    try {
        // Aqui você buscaria os posts onde o usuário foi marcado
        // const tagged = await ApiService.getTaggedPosts(userId);
        
        // Simulando dados
        const tagged = AppState.getPosts().slice(3, 6); // Exemplo
        
        if (tagged.length === 0) {
            taggedPosts.innerHTML = '<div class="empty-state">Nenhum post marcado</div>';
            return;
        }
        
        renderPosts(tagged, taggedPosts, true);
    } catch (error) {
        console.error('Error loading tagged posts:', error);
        taggedPosts.innerHTML = '<div class="error-state">Erro ao carregar marcados</div>';
    }
}

// Renderiza posts em um container
function renderPosts(posts, container, isGrid = true) {
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post, isGrid);
        container.appendChild(postElement);
    });
}

// Cria elemento de post (versão simplificada para o perfil)
function createPostElement(post, isGrid) {
    if (isGrid) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <img src="${post.imagem}" alt="Post">
            <div class="post-overlay">
                <span><i class="fas fa-heart"></i> ${post.likes?.length || 0}</span>
                <span><i class="fas fa-comment"></i> ${post.comentarios?.length || 0}</span>
            </div>
        `;
        gridItem.addEventListener('click', () => {
            // Aqui você poderia abrir uma visualização maior do post
            alert(`Abrir post ${post.id}`);
        });
        return gridItem;
    } else {
        // Versão completa (similar à da home)
        // Implemente conforme necessário
    }
}

// Alterna seguir/parar de seguir usuário
async function toggleFollowUser(userId) {
    const followBtn = document.querySelector('.follow-btn');
    const isFollowing = followBtn.textContent === 'Seguir';
    
    try {
        followBtn.disabled = true;
        followBtn.textContent = isFollowing ? 'Seguindo...' : 'Deixando de seguir...';
        
        // Aqui você faria a chamada à API
        // await ApiService.toggleFollow(userId, isFollowing);
        
        // Simulando resposta
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        followBtn.textContent = isFollowing ? 'Seguindo' : 'Seguir';
        followBtn.classList.toggle('following', isFollowing);
        
        // Atualiza contagem de seguidores
        const currentFollowers = parseInt(followerCount.textContent);
        followerCount.textContent = isFollowing ? currentFollowers + 1 : currentFollowers - 1;
    } catch (error) {
        console.error('Error toggling follow:', error);
        showError('Erro ao atualizar seguindo');
    } finally {
        followBtn.disabled = false;
    }
}

// Mostra mensagem de erro
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