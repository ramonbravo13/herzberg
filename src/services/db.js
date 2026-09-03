import { v4 as uuidv4 } from 'uuid';

const DB_KEY = 'herzberg_db';

// Initial DB state
const initialDb = {
  organizations: [],
  users: [
    {
      id: uuidv4(),
      email: 'admin@herzberg.com',
      password: 'admin',
      role: 'admin',
      name: 'Super Admin'
    }
  ],
  evaluations: []
};

// Initialize DB if empty
const initDB = () => {
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
  }
};

const getDB = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEY));
};

const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const dbService = {
  // --- AUTH ---
  login: async (email, password) => {
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // --- ORGANIZATIONS ---
  getOrganizations: async () => {
    const db = getDB();
    return db.organizations;
  },

  createOrganization: async (name, subscriptionEndDate = null) => {
    const db = getDB();
    const newOrg = {
      id: uuidv4(),
      name,
      evaluation_token: uuidv4(),
      createdAt: new Date().toISOString(),
      subscriptionEndDate
    };
    db.organizations.push(newOrg);
    saveDB(db);
    return newOrg;
  },

  updateOrganization: async (id, updates) => {
    const db = getDB();
    const index = db.organizations.findIndex(o => o.id === id);
    if (index > -1) {
      if (typeof updates === 'string') {
        // Backwards compatibility
        db.organizations[index].name = updates;
      } else {
        db.organizations[index] = { ...db.organizations[index], ...updates };
      }
      saveDB(db);
      return db.organizations[index];
    }
    throw new Error('Organización no encontrada');
  },

  deleteOrganization: async (id) => {
    const db = getDB();
    // Verify if org has users
    const hasUsers = db.users.some(u => u.organization_id === id);
    if (hasUsers) {
      throw new Error('No se puede eliminar la organización porque tiene usuarios asignados.');
    }
    
    db.organizations = db.organizations.filter(o => o.id !== id);
    // Also delete associated evaluations
    db.evaluations = db.evaluations.filter(e => e.organization_id !== id);
    saveDB(db);
    return true;
  },

  getOrganizationByToken: async (token) => {
    const db = getDB();
    return db.organizations.find(o => o.evaluation_token === token);
  },
  
  getOrganizationById: async (id) => {
    const db = getDB();
    return db.organizations.find(o => o.id === id);
  },

  // --- USERS ---
  getUsers: async () => {
    const db = getDB();
    return db.users.map(({ password, ...user }) => user); // Hide passwords
  },

  createUser: async (userData) => {
    const db = getDB();
    if (db.users.find(u => u.email === userData.email)) {
      throw new Error('El correo ya está registrado');
    }
    const newUser = {
      id: uuidv4(),
      ...userData,
      requiresPasswordChange: true,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);
    // Return without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser: async (id, updates) => {
    const db = getDB();
    const index = db.users.findIndex(u => u.id === id);
    if (index > -1) {
      if (updates.email && db.users.some(u => u.email === updates.email && u.id !== id)) {
        throw new Error('El correo ya está en uso por otro usuario');
      }
      db.users[index] = { ...db.users[index], ...updates };
      saveDB(db);
      const { password, ...userWithoutPassword } = db.users[index];
      return userWithoutPassword;
    }
    throw new Error('Usuario no encontrado');
  },

  deleteUser: async (id) => {
    const db = getDB();
    if (id === 'admin-1') {
      throw new Error('No puedes eliminar al administrador principal');
    }
    db.users = db.users.filter(u => u.id !== id);
    saveDB(db);
    return true;
  },
  
  updateUserPassword: async (userId, newPassword) => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if(userIndex > -1) {
       db.users[userIndex].password = newPassword;
       saveDB(db);
       return true;
    }
    throw new Error('Usuario no encontrado');
  },

  confirmPasswordChange: async (userId, newPassword) => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if(userIndex > -1) {
       db.users[userIndex].password = newPassword;
       db.users[userIndex].requiresPasswordChange = false;
       saveDB(db);
       const { password, ...userWithoutPassword } = db.users[userIndex];
       return userWithoutPassword;
    }
    throw new Error('Usuario no encontrado');
  },

  generatePasswordResetToken: async (email) => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.email === email);
    if(userIndex > -1) {
      const token = uuidv4();
      db.users[userIndex].resetToken = token;
      db.users[userIndex].resetTokenExpiry = Date.now() + 3600000; // 1 hour
      saveDB(db);
      return token;
    }
    throw new Error('No existe una cuenta con ese correo electrónico');
  },

  resetPasswordWithToken: async (token, newPassword) => {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.resetToken === token && u.resetTokenExpiry > Date.now());
    if (userIndex > -1) {
      db.users[userIndex].password = newPassword;
      db.users[userIndex].requiresPasswordChange = false;
      delete db.users[userIndex].resetToken;
      delete db.users[userIndex].resetTokenExpiry;
      saveDB(db);
      return true;
    }
    throw new Error('El enlace de recuperación es inválido o ha expirado');
  },

  // --- EVALUATIONS ---
  saveEvaluation: async (organizationId, results) => {
    const db = getDB();
    const evaluation = {
      id: uuidv4(),
      organization_id: organizationId,
      results,
      createdAt: new Date().toISOString()
    };
    db.evaluations.push(evaluation);
    saveDB(db);
    return evaluation;
  },

  getEvaluationsByOrganization: async (organizationId) => {
    const db = getDB();
    return db.evaluations.filter(e => e.organization_id === organizationId).map(e => e.results);
  },
  
  getAllEvaluations: async () => {
    const db = getDB();
    return db.evaluations;
  }
};
