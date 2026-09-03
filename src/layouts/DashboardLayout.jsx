import React from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BarChart3, User, ChevronDown, Link as LinkIcon, Edit, Check, X } from 'lucide-react';
import { dbService } from '../services/db';

export default function DashboardLayout() {
  const { user, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [profileName, setProfileName] = React.useState(user?.name || '');
  const [profileEmail, setProfileEmail] = React.useState(user?.email || '');
  const [orgToken, setOrgToken] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (user?.role === 'empresarial' && user?.organization_id) {
      dbService.getOrganizationById(user.organization_id).then(org => {
        if (org) {
          if (org.subscriptionEndDate && new Date(org.subscriptionEndDate) < new Date()) {
            setIsExpired(true);
          } else {
            setOrgToken(org.evaluation_token);
          }
        }
      });
    }
  }, [user]);

  if (isExpired) {
    return <Navigate to="/expired" replace />;
  }

  const handleCopyLink = () => {
    if (orgToken) {
      const link = `${window.location.origin}/evaluate/${orgToken}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await dbService.updateUser(user.id, {
        name: profileName
      });
      updateCurrentUser(updated);
      setShowEditProfile(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || (user.role !== 'empresarial' && user.role !== 'corporativo' && user.role !== 'admin')) {
    return <div className="p-8 text-center text-red-500 font-bold">Acceso Denegado.</div>;
  }

  if (user.requiresPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800">
                Dashboard {user.role === 'corporativo' && 'Corporativo'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-full focus:outline-none"
                >
                  <User size={16} />
                  <span className="font-medium">{user.name || user.email}</span>
                  <ChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-fade-in">
                    <button
                      onClick={() => { setShowEditProfile(true); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit size={16} className="text-slate-400" /> Editar Perfil
                    </button>
                    
                    {user.role === 'empresarial' && orgToken && (
                      <button
                        onClick={handleCopyLink}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <LinkIcon size={16} className="text-slate-400" />}
                        {copied ? '¡Enlace Copiado!' : 'Copiar Link de Chatbot'}
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-lg transition-colors border border-indigo-100"
                >
                  Volver al Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800 text-lg">Editar Perfil</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  disabled
                  value={profileEmail}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed outline-none"
                  title="El correo no se puede cambiar"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
