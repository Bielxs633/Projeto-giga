// assets/js/comments.js
import ApiService from './api.js';
import AppState from './state-manager.js';

const commentsModal = document.getElementById('commentsModal');
const commentsList = document.getElementById('commentsList');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
let currentPostId = null;

// Abre o modal de comentários para um post específico
export function openCommentsModal(postId) {
    currentPostId = postId;
    commentsModal.style.display = 'flex';
    loadComments(postId);
}

// Fecha o modal de comentários
document.querySelector('#commentsModal .close').addEventListener('click', () => {
    commentsModal.style.display = 'none';
});

// Carrega os comentários de um post
async function loadComments(postId) {
    try {
        commentsList.innerHTML = '<div class="loading">Carregando comentários...</div>';
        
        // Simulando chamada à API - você precisaria implementar o endpoint
        const comments = await ApiService.getPostComments(postId);
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<div class="empty">Nenhum comentário ainda</div>';
            return;
        }
        
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<div class="error">Erro ao carregar comentários</div>';
    }
}

// Cria elemento de comentário
function createCommentElement(comment) {
    const element = document.createElement('div');
    element.className = 'comment-item';
    element.innerHTML = `
        <img src="${comment.user?.imagemPerfil || 'https://via.placeholder.com/150'}" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-username">${comment.user?.nome || 'Usuário'}</div>
            <div class="comment-text">${comment.texto}</div>
            <div class="comment-time">${formatCommentTime(comment.dataCriacao)}</div>
        </div>
    `;
    return element;
}

// Formata o tempo do comentário
function formatCommentTime(dateString) {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
    return `${Math.floor(diffInSeconds / 86400)} d atrás`;
}

// Envia um novo comentário
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    
    if (!text) return;
    
    try {
        const user = AppState.getUser();
        if (!user) throw new Error('Usuário não autenticado');
        
        // Simulando chamada à API
        const newComment = await ApiService.addComment(currentPostId, {
            userId: user.id,
            texto: text
        });
        
        // Adiciona o novo comentário à lista
        const commentElement = createCommentElement({
            ...newComment,
            user: {
                id: user.id,
                nome: user.nome,
                imagemPerfil: user.imagemPerfil
            }
        });
        
        commentsList.appendChild(commentElement);
        commentInput.value = '';
        
        // Rola para o final da lista
        commentsList.scrollTop = commentsList.scrollHeight;
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Erro ao adicionar comentário: ' + error.message);
    }
});