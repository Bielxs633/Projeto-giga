'use strict'

// Seleciona a seção de login
const loginSection = document.querySelector('.login-section')

// Cria o título
const title = document.createElement('h2')
title.textContent = 'Welcome Back!'
loginSection.appendChild(title)

// Cria o parágrafo de descrição
const description = document.createElement('p')
description.textContent = 'Conecte-se, compartilhe e descubra o que está acontecendo no setor com uma conta.'
loginSection.appendChild(description)

// Cria o formulário
const form = document.createElement('form')

// Cria o campo de e-mail
const emailInput = document.createElement('input')
emailInput.type = 'email'
emailInput.id = 'email'
emailInput.placeholder = 'E-mail'
emailInput.required = true
form.appendChild(emailInput)

// Cria o campo de senha
const passwordInput = document.createElement('input')
passwordInput.type = 'password'
passwordInput.id = 'password';
passwordInput.placeholder = 'Password';
passwordInput.required = true;
form.appendChild(passwordInput);

// Cria a seção Esqueceu a senha
const rememberForgot = document.createElement('div');
rememberForgot.className = 'remember-forgot';

const forgotPasswordLink = document.createElement('a');
forgotPasswordLink.href = './pages/redefinirSenha.html';
forgotPasswordLink.textContent = 'Esqueceu sua senha?';
rememberForgot.appendChild(forgotPasswordLink);

form.appendChild(rememberForgot);

// Cria o botão de submit
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Sign In';
form.appendChild(submitButton);

// Adiciona o formulário à seção de login
loginSection.appendChild(form);

// Cria o parágrafo de cadastro
const registerText = document.createElement('p');
registerText.innerHTML = 'Não tem uma conta? <a href="./pages/cadastro.html">Cadastre-se</a>';
loginSection.appendChild(registerText);

// Cria o elemento de mensagem de erro
const errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.display = 'none';
loginSection.appendChild(errorMessage)

// Evento de submit do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = emailInput.value.trim()
    const senha = passwordInput.value.trim()


    if (!email || !senha) {
        errorMessage.textContent = 'Preencha todos os campos!'
        errorMessage.style.display = 'block'
        return;
    }

    try {
        const response = await fetch('https://back-spider.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login')
        }

        // Armazena o token e os dados do usuário no localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redireciona para a página principal após o login
        window.location.href = './pages/home.html'

    } catch (error) {
        errorMessage.textContent = error.message
        errorMessage.style.display = 'block'
    }
})