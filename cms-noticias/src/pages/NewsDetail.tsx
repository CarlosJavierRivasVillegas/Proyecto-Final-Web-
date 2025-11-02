import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsById } from '../services/news';
import { Container, Typography } from '@mui/material';
import type { News } from '../types';

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    if (!id) return;
    getNewsById(id).then(setNews).catch(() => setNews(null));
  }, [id]);

  if (!news) return <Container sx={{ mt: 4 }}>Noticia no encontrada</Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">{news.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{news.subtitle}</Typography>
      <Typography sx={{ mt: 2 }}>{news.content}</Typography>
    </Container>
  );
};

export default NewsDetail;
