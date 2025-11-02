import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail } from '../services/auth';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5">Iniciar sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
          <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Entrar</Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">¿No tienes cuenta? <Link to="/register">Regístrate</Link></Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
