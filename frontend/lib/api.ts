async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

  const res = await fetch(`https://api.padinhoinvest.com.br/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
}

async function adminRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;

  const res = await fetch(`https://api.padinhoinvest.com.br/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
}

export const api = {
  auth: {
    register: (email: string) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    login: (email: string) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    me: () => request('/auth/me'),
    update: (data: { telefone?: string; trader_id?: string }) =>
      request('/auth/update', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  webhook: {
    ativar: (trader_id: string) =>
      request('/webhook/ativar', {
        method: 'POST',
        body: JSON.stringify({ trader_id }),
      }),
  },
  lessons: {
    trackView: (slug: string) =>
      request('/lessons/view', {
        method: 'POST',
        body: JSON.stringify({ slug }),
      }),
  },
  admin: {
    login: (email: string, password: string) =>
      adminRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    dashboard: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString();
      return adminRequest(`/admin/dashboard${qs ? `?${qs}` : ''}`);
    },
    users: (page = 1, search?: string) => {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (search) params.set('search', search);
      return adminRequest(`/admin/users?${params}`);
    },
    updateUser: (id: string, data: { ja_pagou?: boolean; ja_registrado?: boolean; trader_id?: string }) =>
      adminRequest(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    exportCsvUrl: () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;
      return `https://api.padinhoinvest.com.br/api/admin/users/export?token=${token}`;
    },
    webhookLogs: (page = 1, type?: string) => {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (type) params.set('type', type);
      return adminRequest(`/admin/webhooks?${params}`);
    },
    activityLogs: (page = 1, userId?: string) => {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (userId) params.set('user_id', userId);
      return adminRequest(`/admin/activity?${params}`);
    },
    createUser: (email: string, ja_registrado?: boolean, ja_pagou?: boolean) =>
      adminRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, ja_registrado, ja_pagou }),
      }),
    deleteUser: (id: string) =>
      adminRequest(`/admin/users/${id}`, { method: 'DELETE' }),
    changePassword: (currentPassword: string, newPassword: string) =>
      adminRequest('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
};
