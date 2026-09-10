// Frontend DB Service Proxy
// This replaces the old localStorage logic and now securely communicates with the Vercel backend.
// The frontend NO LONGER has direct access to the database (Zero Trust).

const apiCall = async (action, payload = {}) => {
  const response = await fetch('/api/db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición a la base de datos');
  }
  return data;
};

export const dbService = {
  login: async (email, password) => {
    return await apiCall('login', { email, password });
  },

  logout: async () => {
    return await apiCall('logout');
  },

  getOrganizations: async () => {
    return await apiCall('getOrganizations');
  },

  createOrganization: async (name, subscriptionEndDate = null) => {
    return await apiCall('createOrganization', { name, subscriptionEndDate });
  },

  updateOrganization: async (id, updates) => {
    return await apiCall('updateOrganization', { id, updates });
  },

  deleteOrganization: async (id) => {
    return await apiCall('deleteOrganization', { id });
  },

  restartOrganizationPeriod: async (orgId) => {
    return await apiCall('restartOrganizationPeriod', { orgId });
  },

  getOrganizationByToken: async (token) => {
    return await apiCall('getOrganizationByToken', { token });
  },

  getOrganizationById: async (id) => {
    return await apiCall('getOrganizationById', { id });
  },

  getUsers: async () => {
    return await apiCall('getUsers');
  },

  createUser: async (userData) => {
    return await apiCall('createUser', { userData });
  },

  updateUser: async (id, updates) => {
    return await apiCall('updateUser', { id, updates });
  },

  deleteUser: async (id) => {
    return await apiCall('deleteUser', { id });
  },

  updateUserPassword: async (userId, newPassword) => {
    return await apiCall('updateUserPassword', { userId, newPassword });
  },

  confirmPasswordChange: async (userId, newPassword) => {
    return await apiCall('confirmPasswordChange', { userId, newPassword });
  },

  generatePasswordResetToken: async (email) => {
    throw new Error('Recuperación de contraseña no implementada en la versión segura. Contacte al administrador.');
  },

  resetPasswordWithToken: async (token, newPassword) => {
    throw new Error('No implementado');
  },

  saveEvaluation: async (organizationId, results, zone = null) => {
    return await apiCall('saveEvaluation', { organizationId, results, zone });
  },

  checkParticipantCompletion: async (organizationId, period) => {
    const res = await apiCall('checkParticipantCompletion', { organizationId, period });
    return res.completed;
  },

  getEvaluationsByOrganization: async (organizationId) => {
    return await apiCall('getEvaluationsByOrganization', { organizationId });
  },

  getAllEvaluations: async () => {
    return await apiCall('getAllEvaluations');
  }
};
