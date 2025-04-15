'use strict'

// Seleciona a seção de perfil
const profileSection = document.querySelector('.profile-section');

// Cria o cabeçalho do perfil
const profileHeader = document.createElement('div');
profileHeader.className = 'profile-header';
profileSection.appendChild(profileHeader);

// Cria o nome de usuário
const username = document.createElement('div');
username.className = 'username';
username.textContent = 'Drake';
profileHeader.appendChild(username);

// Cria o handle (@)
const handle = document.createElement('div');
handle.className = 'handle';
handle.textContent = '@Drake_Malvadão';
profileHeader.appendChild(handle);

// Cria as estatísticas
const stats = document.createElement('div');
stats.className = 'stats';

// Seguidores
const followersStat = document.createElement('div');
followersStat.className = 'stat';
const followersValue = document.createElement('div');
followersValue.className = 'stat-value';
followersValue.textContent = '69';
const followersLabel = document.createElement('div');
followersLabel.className = 'stat-label';
followersLabel.textContent = 'Seguidores';
followersStat.appendChild(followersValue);
followersStat.appendChild(followersLabel);
stats.appendChild(followersStat);

// Seguindo
const followingStat = document.createElement('div');
followingStat.className = 'stat';
const followingValue = document.createElement('div');
followingValue.className = 'stat-value';
followingValue.textContent = '13';
const followingLabel = document.createElement('div');
followingLabel.className = 'stat-label';
followingLabel.textContent = 'Seguindo';
followingStat.appendChild(followingValue);
followingStat.appendChild(followingLabel);
stats.appendChild(followingStat);

// Posts
const postsStat = document.createElement('div');
postsStat.className = 'stat';
const postsValue = document.createElement('div');
postsValue.className = 'stat-value';
postsValue.textContent = '28';
const postsLabel = document.createElement('div');
postsLabel.className = 'stat-label';
postsLabel.textContent = 'Posts';
postsStat.appendChild(postsValue);
postsStat.appendChild(postsLabel);
stats.appendChild(postsStat);

profileHeader.appendChild(stats);

// Divisor
const divider = document.createElement('div');
divider.className = 'divider';
profileSection.appendChild(divider);

// Nome do perfil (repetido 3 vezes)
const profileName = document.createElement('div');
profileName.className = 'profile-name';

const name1 = document.createElement('span');
name1.textContent = 'Drake';
profileName.appendChild(name1);

const name2 = document.createElement('span');
name2.textContent = 'Drake';
profileName.appendChild(name2);

const name3 = document.createElement('span');
name3.textContent = 'Drake';
profileName.appendChild(name3);

profileSection.appendChild(profileName);