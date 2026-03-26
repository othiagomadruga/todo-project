import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { FolderKanban, Plus, LogOut, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  _count?: { tasks: number };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowNewConfig(false);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente apagar este projeto?')) return;
    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient flex items-center gap-2" style={{ fontSize: '2.5rem' }}>
            <FolderKanban size={36} color="var(--primary-color)" />
            Meus Projetos
          </h1>
          <p>Gerencie suas iniciativas e acompanhe progresso</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      {showNewConfig ? (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Novo Projeto</h3>
          <form onSubmit={handleCreateProject} style={{ marginTop: '1rem' }}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Nome do Projeto *"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Descrição (Opcional)"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Salvar Projeto</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewConfig(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          className="btn btn-primary" 
          style={{ marginBottom: '2rem' }} 
          onClick={() => setShowNewConfig(true)}
        >
          <Plus size={20} /> Criar Novo Projeto
        </button>
      )}

      {loading ? (
        <p>Carregando projetos...</p>
      ) : projects.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>Nenhum projeto encontrado</h3>
          <p>Crie seu primeiro projeto acima para começar!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="glass-panel" 
              style={{ padding: '1.5rem', cursor: 'pointer', transition: 'var(--transition)' }}
              onClick={() => navigate(`/projects/${project.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div className="flex justify-between items-center">
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{project.name}</h3>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '0.4rem' }}
                  onClick={(e) => handleDelete(project.id, e)}
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {project.description || 'Sem descrição'}
              </p>
              <div style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                {project._count?.tasks || 0} Tarefas
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
