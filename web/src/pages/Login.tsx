import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    api.get('/visits').then(res => setVisits(res.data.count)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro interno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
        <h2 className="text-gradient" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>
          {isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isRegister ? 'Junte-se à melhor plataforma de gestão' : 'Acesse seus projetos pessoais'}
        </p>

        {error && (
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="var(--danger)" />
            <span style={{ color: 'var(--danger)' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
            {loading ? 'Aguarde...' : (isRegister ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>
            {isRegister ? 'Já possui conta?' : 'Ainda não tem conta?'}
            <button 
              type="button" 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', marginLeft: '8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {isRegister ? 'Faça login' : 'Crie uma'}
            </button>
          </p>
        </div>
      </div>
      
      {visits !== null && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.85rem' }}>
          👁️ Visitantes: <b>{visits}</b>
        </div>
      )}
    </div>
  );
}
