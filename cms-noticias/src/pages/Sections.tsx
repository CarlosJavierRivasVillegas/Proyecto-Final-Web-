import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Stack, Card, CardContent, IconButton } from '@mui/material';
import { listSections, createSection, updateSection, deleteSection } from '../services/sections';
import type { Section } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SectionsPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => listSections().then(setSections).catch(() => setSections([]));

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!name) {
      setError('El nombre es obligatorio');
      return;
    }
    try {
      if (editingId) {
        await updateSection(editingId, { name });
      } else {
        await createSection({ name });
      }
      setName('');
      setEditingId(null);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Error al guardar sección');
    }
  };

  const startEdit = (s: Section) => { setEditingId(s.id); setName(s.name || ''); };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar sección?')) return;
    await deleteSection(id);
    load();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">Secciones</Typography>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Button variant="contained" onClick={handleSave}>{editingId ? 'Actualizar' : 'Crear'}</Button>
        </Stack>
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {sections.map((s) => (
          <Card key={s.id}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>{s.name}</Typography>
              <Box>
                <IconButton onClick={() => startEdit(s)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(s.id)}><DeleteIcon /></IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default SectionsPage;
