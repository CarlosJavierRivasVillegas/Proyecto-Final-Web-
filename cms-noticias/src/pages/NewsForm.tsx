import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNews, getNewsById, updateNews, changeNewsStatus } from '../services/news';
import { listSections } from '../services/sections';
import { useAuth } from '../context/AuthContext';
import { Container, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl, TextField, LinearProgress } from '@mui/material';
import type { News } from '../types';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadFile } from '../services/storage';

const schema = z.object({
  title: z.string().min(1, 'Título es obligatorio'),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Contenido es obligatorio'),
  category: z.string().min(1, 'Categoría es obligatoria'),
  imageFile: z.instanceof(File).optional(),
});

type FormSchema = z.infer<typeof schema>;

const NewsForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit, setValue, reset, getValues, watch, formState: { errors, isSubmitting } } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const [sections, setSections] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    listSections()
      .then((s) => {
        const mapped = s.map((sec) => ({ id: sec.id, name: sec.name }));
        setSections(mapped);
        const currentCategory = getValues('category');
        if (!currentCategory) setValue('category', mapped[0]?.name || '');
      })
      .catch(() => {});

    if (isEdit && id) {
      getNewsById(id).then((n) => {
        if (!n) return;
        reset({ title: n.title, subtitle: n.subtitle, content: n.content, category: n.category });
      }).catch(() => {});
    }
  }, [id, isEdit, reset, setValue, getValues]);

  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormSchema) => {
    try {
      let imageUrl = '';
      const file = watch('imageFile') as File | undefined;
      if (file) {
        // Intentamos subir a Storage si está disponible y reportar progreso
        try {
          setUploadProgress(0);
          imageUrl = await uploadFile(file, 'images', (percent) => setUploadProgress(percent));
          setUploadProgress(null);
        } catch (err) {
          setUploadProgress(null);
          const message = err instanceof Error ? err.message : String(err);
          // Abortamos el guardado para mantener integridad de datos
          setFormError('Error al subir la imagen: ' + message);
          return; // abort
        }
      }

      if (isEdit && id) {
        await updateNews(id, { title: data.title, subtitle: data.subtitle || '', content: data.content, category: data.category, imageUrl } as Partial<News>);
      } else {
        await createNews({ title: data.title, subtitle: data.subtitle || '', content: data.content, category: data.category, imageUrl, authorId: user?.uid, authorName: user?.displayName } as Partial<News>);
      }
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setFormError(message || 'Error al guardar la noticia');
    }
  };

  const handleChangeStatus = async (newStatus: 'published' | 'disabled' | 'finished') => {
    if (!id) return;
    try {
      await changeNewsStatus(id, newStatus);
      // actualizar la vista o notificar
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Error al cambiar estado');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5">{isEdit ? 'Editar noticia' : 'Nueva noticia'}</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Controller name="title" control={control} defaultValue="" render={({ field }) => (
          <TextField label="Título" {...field} fullWidth margin="normal" error={!!errors.title} helperText={errors.title?.message} />
        )} />

        <Controller name="subtitle" control={control} defaultValue="" render={({ field }) => (
          <TextField label="Subtítulo" {...field} fullWidth margin="normal" />
        )} />

        <Controller name="content" control={control} defaultValue="" render={({ field }) => (
          <TextField label="Contenido" {...field} fullWidth multiline rows={6} margin="normal" error={!!errors.content} helperText={errors.content?.message} />
        )} />

        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Categoría</InputLabel>
          <Controller name="category" control={control} defaultValue="" render={({ field }) => (
            <Select labelId="category-label" {...field} label="Categoría">
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
              ))}
            </Select>
          )} />
        </FormControl>

        <Controller name="imageFile" control={control} defaultValue={undefined} render={({ field }) => (
          <input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
        )} />

        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
          <Button type="submit" variant="contained" disabled={isSubmitting || uploadProgress !== null}>Guardar</Button>
          {uploadProgress !== null && (
            <Box sx={{ width: 200, ml: 2 }}>
              <Typography variant="body2">Subiendo imagen: {uploadProgress}%</Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
          {isEdit && user?.role === 'editor' && (
            <>
              <Button variant="outlined" color="success" onClick={() => handleChangeStatus('published')}>Publicar</Button>
              <Button variant="outlined" color="warning" onClick={() => handleChangeStatus('finished')}>Marcar como terminado</Button>
              <Button variant="outlined" color="error" onClick={() => handleChangeStatus('disabled')}>Desactivar</Button>
            </>
          )}
        </Box>
        {formError && <Typography color="error" sx={{ mt: 2 }}>{formError}</Typography>}
      </Box>
    </Container>
  );
};

export default NewsForm;
