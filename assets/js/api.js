    // assets/js/api.js
    const API_BASE = 'https://back-spider.vercel.app';
    const API_TIMEOUT = 10000;

    const Endpoints = {
        AUTH: {
            LOGIN: `${API_BASE}/login`,
            REGISTER: `${API_BASE}/user/cadastrarUser`,
            PROFILE: (userId) => `${API_BASE}/user/listarUser/${userId}`,
            UPDATE_PASSWORD: (userId) => `${API_BASE}/user/newPassword/${userId}`,
            RECOVER_PASSWORD: `${API_BASE}/user/RememberPassword`
        },
        POSTS: {
            LIST: `${API_BASE}/publicacoes/listarPublicacoes`,
            CREATE: `${API_BASE}/publicacoes/cadastrarPublicacao`,
            LIKE: (postId) => `${API_BASE}/publicacoes/likePublicacao/${postId}`,
            DELETE: (postId) => `${API_BASE}/publicacoes/deletarPublicacao/${postId}`
        },
        STORIES: {
            LIST: `${API_BASE}/storys/listarStorys`,
            CREATE: `${API_BASE}/storys/cadastrarStorys`
        },
        UPLOAD: `${API_BASE}/upload`
    };

    class ApiService {
        static async request(endpoint, method, body = null, requiresAuth = true) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

            const headers = {};
            let requestBody = body;

            if (body instanceof FormData) {
                // Não definir Content-Type para FormData - o navegador irá definir automaticamente
                // com o boundary correto
            } else if (body) {
                headers['Content-Type'] = 'application/json';
                requestBody = JSON.stringify(body);
            }

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication required');
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
                const response = await fetch(endpoint, {
                    method,
                    headers,
                    body: requestBody,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await this.parseResponse(response);
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                return await this.parseResponse(response);
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('API Request Error:', error);
                throw new Error(error.message || 'Network request failed');
            }
        }

        static async parseResponse(response) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        }

        // Métodos específicos
        static async login(credentials) {
            return this.request(Endpoints.AUTH.LOGIN, 'POST', credentials, false);
        }

        static async register(userData) {
            return this.request(Endpoints.AUTH.REGISTER, 'POST', userData, false);
        }

        static async getProfile(userId) {
            return this.request(Endpoints.AUTH.PROFILE(userId), 'GET');
        }

        static async updatePassword(userId, newPassword) {
            return this.request(Endpoints.AUTH.UPDATE_PASSWORD(userId), 'PUT', { senha: newPassword });
        }

        static async recoverPassword(email, recoveryKey) {
            return this.request(Endpoints.AUTH.RECOVER_PASSWORD, 'POST', { email, wordKey: recoveryKey }, false);
        }

        static async getPosts() {
            return this.request(Endpoints.POSTS.LIST, 'GET');
        }

        static async createPost(postData) {
            return this.request(Endpoints.POSTS.CREATE, 'POST', postData);
        }

        static async likePost(postId, userId) {
            return this.request(Endpoints.POSTS.LIKE(postId), 'PUT', { idUser: userId });
        }

        static async deletePost(postId) {
            return this.request(Endpoints.POSTS.DELETE(postId), 'DELETE');
        }

        static async getStories() {
            return this.request(Endpoints.STORIES.LIST, 'GET');
        }

        static async createStory(storyData) {
            return this.request(Endpoints.STORIES.CREATE, 'POST', storyData);
        }

        static async uploadFile(file) {
            const formData = new FormData();
            formData.append('file', file);
            return this.request(Endpoints.UPLOAD, 'POST', formData);
        }
    }

    export default ApiService;