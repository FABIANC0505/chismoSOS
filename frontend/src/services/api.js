const API_BASE = '/api';

function getHeaders(isJson = true) {
  const token = localStorage.getItem('chismoSOS_token');
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Ocurrió un error inesperado';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }
  if (response.status === 204) {
    return null;
  }
  return await response.json();
}

export const api = {
  // --- AUTH ---
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(res);
    localStorage.setItem('chismoSOS_token', data.access_token);
    localStorage.setItem('chismoSOS_user', JSON.stringify(data.user));
    return data;
  },

  async register(username, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(res);
    localStorage.setItem('chismoSOS_token', data.access_token);
    localStorage.setItem('chismoSOS_user', JSON.stringify(data.user));
    return data;
  },

  getCurrentUser() {
    const stored = localStorage.getItem('chismoSOS_user');
    return stored ? JSON.parse(stored) : null;
  },

  logout() {
    localStorage.removeItem('chismoSOS_token');
    localStorage.removeItem('chismoSOS_user');
  },

  // --- EXPERIENCES (CREATOR) ---
  async getMyExperiences() {
    const res = await fetch(`${API_BASE}/experiences`, {
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  async createExperience(data) {
    const res = await fetch(`${API_BASE}/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  async getExperience(id) {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  async updateExperience(id, data) {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },

  async deleteExperience(id) {
    const res = await fetch(`${API_BASE}/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  // --- CARDS ---
  async addCard(experienceId, cardData) {
    const res = await fetch(`${API_BASE}/experiences/${experienceId}/cards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    return await handleResponse(res);
  },

  async updateCard(cardId, cardData) {
    const res = await fetch(`${API_BASE}/cards/${cardId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    return await handleResponse(res);
  },

  async deleteCard(cardId) {
    const res = await fetch(`${API_BASE}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/cards/upload`, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData
    });
    return await handleResponse(res);
  },

  // --- SELECTION STEPS ---
  async addStep(experienceId, stepData) {
    const res = await fetch(`${API_BASE}/experiences/${experienceId}/steps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stepData)
    });
    return await handleResponse(res);
  },

  async updateStep(stepId, stepData) {
    const res = await fetch(`${API_BASE}/steps/${stepId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stepData)
    });
    return await handleResponse(res);
  },

  async deleteStep(stepId) {
    const res = await fetch(`${API_BASE}/steps/${stepId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await handleResponse(res);
  },

  // --- PUBLIC RECIPIENT VIEW ---
  async getPublicExperience(slug) {
    const res = await fetch(`${API_BASE}/public/experience/${slug}`);
    return await handleResponse(res);
  }
};
