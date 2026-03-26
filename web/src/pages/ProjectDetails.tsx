import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, CheckCircle2, Clock, CircleDot, Plus, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  completedAt?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const loadProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      await api.post('/tasks', { title: newTaskTitle, projectId: id, status: 'TODO' });
      setNewTaskTitle('');
      setShowTaskForm(false);
      loadProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      loadProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Deseja apagar esta tarefa?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      loadProject();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (!project) return <div>Projeto não encontrado</div>;

  const getStatusIcon = (status: string) => {
    if (status === 'TODO') return <CircleDot size={20} color="var(--text-secondary)" />;
    if (status === 'IN_PROGRESS') return <Clock size={20} color="var(--warning)" />;
    if (status === 'DONE') return <CheckCircle2 size={20} color="var(--success)" />;
    return null;
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-secondary" 
          style={{ padding: '0.4rem 0.8rem', marginBottom: '1.5rem' }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>{project.name}</h1>
        <p>{project.description || 'Gerenciamento de tarefas deste projeto'}</p>
      </header>

      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Tarefas do Projeto</h2>
        {!showTaskForm && (
          <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
            <Plus size={18} /> Adicionar Tarefa
          </button>
        )}
      </div>

      {showTaskForm && (
        <form onSubmit={handleCreateTask} className="glass-panel flex gap-4 items-center" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="O que precisa ser feito?"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary">Salvar</button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowTaskForm(false)}>Cancelar</button>
        </form>
      )}

      <div className="glass-panel" style={{ padding: '1px' }}>
        {project.tasks.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>Nenhuma tarefa cadastrada.</div>
        ) : (
          project.tasks.map((task, index) => (
            <div 
              key={task.id} 
              className="flex justify-between items-center"
              style={{ 
                padding: '1.25rem 1.5rem', 
                borderBottom: index !== project.tasks.length - 1 ? '1px solid var(--surface-border)' : 'none',
                background: task.status === 'DONE' ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
              }}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(task.status)}
                <span style={{ 
                  fontSize: '1.1rem', 
                  textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                  color: task.status === 'DONE' ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>
                  {task.title}
                </span>
                {task.completedAt && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', marginLeft: '8px' }}>
                    Concluída em {new Date(task.completedAt).toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <select 
                  className="form-input" 
                  style={{ width: '160px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="TODO">A Fazer</option>
                  <option value="IN_PROGRESS">Em Progresso</option>
                  <option value="DONE">Concluído</option>
                </select>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem' }}
                  onClick={() => handleDeleteTask(task.id)}
                  title="Remover Tarefa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
