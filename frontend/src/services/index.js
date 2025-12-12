import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const dashboardService = {
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  },
};

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getAuditLogs: async (limit = 100) => {
    const response = await api.get(`/admin/audit-logs?limit=${limit}`);
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get('/admin/roles');
    return response.data;
  },
};

export const financeService = {
  // General Ledger
  getAccounts: async () => {
    const response = await api.get('/general-ledger/accounts');
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post('/general-ledger/accounts', accountData);
    return response.data;
  },

  getJournalEntries: async () => {
    const response = await api.get('/general-ledger/journal-entries');
    return response.data;
  },

  createJournalEntry: async (entryData) => {
    const response = await api.post('/general-ledger/journal-entries', entryData);
    return response.data;
  },

  approveJournalEntry: async (id) => {
    const response = await api.put(`/general-ledger/journal-entries/${id}/approve`);
    return response.data;
  },

  getBalanceSheet: async (asOfDate) => {
    const response = await api.get('/general-ledger/reports/balance-sheet', {
      params: { as_of_date: asOfDate }
    });
    return response.data;
  },

  getProfitLoss: async (startDate, endDate) => {
    const response = await api.get('/general-ledger/reports/profit-loss', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getCashFlow: async (startDate, endDate) => {
    const response = await api.get('/general-ledger/reports/cash-flow', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Finance Dashboard
  getFinanceDashboard: async () => {
    const response = await api.get('/finance-dashboard');
    return response.data;
  },

  // Vendors & Customers
  getVendors: async () => {
    const response = await api.get('/vendors');
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await api.post('/vendors', vendorData);
    return response.data;
  },

  getCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Invoices & Payments
  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  updateInvoice: async (id, invoiceData) => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  recordPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
};

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const aiInsightsService = {
  getSummary: async () => {
    const response = await api.get('/ai-insights/summary');
    return response.data;
  },

  getProjectRisk: async (id) => {
    const response = await api.get(`/ai-insights/project-risk/${id}`);
    return response.data;
  },

  getAllProjectRisks: async () => {
    const response = await api.get('/ai-insights/project-risks');
    return response.data;
  },

  getCashFlowForecast: async () => {
    const response = await api.get('/ai-insights/cash-flow-forecast');
    return response.data;
  },

  getProjectHealth: async (id) => {
    const response = await api.get(`/ai-insights/project-health/${id}`);
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
