import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail } from '../services/auth';
import { TextField, Button, Container, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'reporter' | 'editor'>('reporter');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerWithEmail(email, password, displayName, role);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Error al registrarse');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5">Registro</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nombre" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth margin="normal" />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
          <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Rol</InputLabel>
            <Select labelId="role-label" value={role} label="Rol" onChange={(e) => setRole(e.target.value as 'reporter' | 'editor')}>
              <MenuItem value="reporter">Reportero</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </Select>
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Crear cuenta</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
