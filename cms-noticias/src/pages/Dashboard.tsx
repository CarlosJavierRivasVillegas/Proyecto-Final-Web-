import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, Stack, Card, CardContent, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { listNewsByAuthor, listAllNews } from '../services/news';
import { useNavigate } from 'react-router-dom';
import type { News } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'editor') {
        const all = await listAllNews();
        setNews(all);
      } else {
        const mine = await listNewsByAuthor(user.uid);
        setNews(mine);
      }
    } catch {
      setNews([]);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Panel administrativo</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => navigate('/dashboard/news/new')}>Nueva noticia</Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard/sections')}>Secciones</Button>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {news.map((n) => (
          <Card key={n.id}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{n.title}</Typography>
                <Typography variant="body2" color="text.secondary">{n.subtitle}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => navigate(`/dashboard/news/${n.id}/edit`)}>Editar</Button>
                {user?.role === 'editor' && (
                  <>
                    <Button size="small" color="success" onClick={async () => { await (await import('../services/news')).changeNewsStatus(n.id, 'published'); load(); }}>Publicar</Button>
                    <Button size="small" color="error" onClick={async () => { await (await import('../services/news')).changeNewsStatus(n.id, 'disabled'); load(); }}>Desactivar</Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Dashboard;
