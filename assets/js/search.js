// assets/js/search.js
import ApiService from './api.js';
import AppState from './state-manager.js';

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let searchTimeout;

// Configura o evento de pesquisa
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    searchTimeout = setTimeout(() => performSearch(query), 500);
});

// Fecha os resultados ao clicar fora
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) ){
        searchResults.style.display = 'none';
    }
});

// Executa a pesquisa
async function performSearch(query) {
    try {
        // Aqui você faria a chamada à API para buscar usuários e posts
        // Por enquanto, vamos simular com dados locais
        const users = await searchUsers(query);
        const posts = await searchPosts(query);
        
        displaySearchResults(users, posts);
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="search-error">Erro ao buscar resultados</div>';
        searchResults.style.display = 'block';
    }
}

// Simula busca de usuários
async function searchUsers(query) {
    const allUsers = await ApiService.getAllUsers(); // Você precisaria implementar este método na API
    return allUsers.filter(user => 
        user.nome.toLowerCase().includes(query.toLowerCase()) || 
        user.email.toLowerCase().includes(query.toLowerCase())
    );
}

// Simula busca de posts
async function searchPosts(query) {
    const allPosts = AppState.getPosts();
    return allPosts.filter(post => 
        post.descricao.toLowerCase().includes(query.toLowerCase())
    );
}

// Exibe os resultados da pesquisa
function displaySearchResults(users, posts) {
    searchResults.innerHTML = '';
    
    if (users.length === 0 && posts.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">Nenhum resultado encontrado</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    if (users.length > 0) {
        const usersHeader = document.createElement('div');
        usersHeader.className = 'search-header';
        usersHeader.textContent = 'Usuários';
        searchResults.appendChild(usersHeader);
        
        users.forEach(user => {
            const userElement = createUserResult(user);
            searchResults.appendChild(userElement);
        });
    }
    
    if (posts.length > 0) {
        const postsHeader = document.createElement('div');
        postsHeader.className = 'search-header';
        postsHeader.textContent = 'Publicações';
        searchResults.appendChild(postsHeader);
        
        posts.forEach(post => {
            const postElement = createPostResult(post);
            searchResults.appendChild(postElement);
        });
    }
    
    searchResults.style.display = 'block';
}

// Cria elemento de resultado de usuário
function createUserResult(user) {
    const element = document.createElement('div');
    element.className = 'search-result-item';
    element.innerHTML = `
        <img src="${user.imagemPerfil || 'https://via.placeholder.com/150'}" alt="${user.nome}">
        <div class="user-info">
            <div class="username">${user.nome}</div>
            <div class="name">@${user.email.split('@')[0]}</div>
        </div>
    `;
    
    element.addEventListener('click', () => {
        window.location.href = `perfil.html?user=${user.id}`;
    });
    
    return element;
}

// Cria elemento de resultado de post
function createPostResult(post) {
    const element = document.createElement('div');
    element.className = 'search-result-item post-result';
    element.innerHTML = `
        <img src="${post.imagem}" alt="Post" class="post-thumbnail">
        <div class="post-info">
            <div class="caption">${post.descricao.substring(0, 50)}${post.descricao.length > 50 ? '...' : ''}</div>
            <div class="author">Por ${post.user?.nome || 'Usuário'}</div>
        </div>
    `;
    
    element.addEventListener('click', () => {
        // Aqui você poderia implementar a navegação para o post específico
        alert(`Post ${post.id} selecionado`);
    });
    
    return element;
}