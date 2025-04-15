// assets/js/state-manager.js
class StateManager {
  constructor() {
      this.state = {
          user: null,
          posts: [],
          stories: [],
          notifications: [],
          isLoading: false,
          error: null
      };
      this.init();
  }

  init() {
      this.loadFromLocalStorage();
      this.setupEventListeners();
  }

  loadFromLocalStorage() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
          try {
              this.state.user = JSON.parse(user);
          } catch (e) {
              console.error('Failed to parse user data', e);
              this.clearAuth();
          }
      }
  }

  setupEventListeners() {
      window.addEventListener('storage', (event) => {
          if (event.key === 'user' || event.key === 'token') {
              this.loadFromLocalStorage();
          }
      });
  }

  // Métodos de atualização de estado
  setUser(user) {
      this.state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.dispatchEvent('userChanged');
  }

  setToken(token) {
      localStorage.setItem('token', token);
      this.dispatchEvent('authChanged');
  }

  setPosts(posts) {
      this.state.posts = posts;
      this.dispatchEvent('postsUpdated');
  }

  setStories(stories) {
      this.state.stories = stories;
      this.dispatchEvent('storiesUpdated');
  }

  setLoading(isLoading) {
      this.state.isLoading = isLoading;
      this.dispatchEvent('loadingStateChanged');
  }

  setError(error) {
      this.state.error = error;
      this.dispatchEvent('errorOccurred');
  }

  // Métodos de autenticação
  clearAuth() {
      this.state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.dispatchEvent('authChanged');
  }

  isAuthenticated() {
      return !!this.state.user && !!localStorage.getItem('token');
  }

  // Métodos para posts
  addPost(post) {
      this.state.posts.unshift(post);
      this.dispatchEvent('postsUpdated');
  }

  updatePost(updatedPost) {
      this.state.posts = this.state.posts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
      );
      this.dispatchEvent('postsUpdated');
  }

  // Event system
  dispatchEvent(eventName) {
      window.dispatchEvent(new CustomEvent(eventName, { detail: this.state }));
  }

  subscribe(eventName, callback) {
      const handler = (event) => callback(event.detail);
      window.addEventListener(eventName, handler);
      return () => window.removeEventListener(eventName, handler);
  }

  // Getters
  getState() {
      return { ...this.state };
  }

  getUser() {
      return this.state.user ? { ...this.state.user } : null;
  }

  getPosts() {
      return [...this.state.posts];
  }

  getStories() {
      return [...this.state.stories];
  }
}

// Singleton instance
const AppState = new StateManager();

export default AppState;