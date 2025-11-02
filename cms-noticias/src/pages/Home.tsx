import React, { useEffect, useState } from 'react';
import { listPublishedNews, listPublishedNewsBySection } from '../services/news';
import { listSections } from '../services/sections';
import { Container, Typography, Card, CardContent, Stack, CardActionArea, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { News } from '../types';
import type { Section } from '../types';

const Home: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // cargamos secciones y noticias por sección
    listSections().then((s) => setSections(s)).catch(() => setSections([]));
    listPublishedNews().then(setNews).catch(() => setNews([]));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Noticias por sección</Typography>

      {sections.map((sec) => (
        <div key={sec.id} style={{ marginBottom: 24 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>{sec.name}</Typography>
          <SectionNewsList sectionName={sec.name} navigate={navigate} />
          <Divider sx={{ mt: 2 }} />
        </div>
      ))}

      {/* fallback: noticias sin sección */}
      {news.filter((n) => !n.category).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Typography variant="h5">Otras noticias</Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {news.filter((n) => !n.category).map((n) => (
              <Card key={n.id}>
                <CardActionArea onClick={() => navigate(`/noticia/${n.id}`)}>
                  <CardContent>
                    <Typography variant="h6">{n.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{n.subtitle}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </div>
      )}
    </Container>
  );
};

const SectionNewsList: React.FC<{ sectionName: string; navigate: (to: string) => void }> = ({ sectionName, navigate }) => {
  const [items, setItems] = useState<News[]>([]);
  useEffect(() => { listPublishedNewsBySection(sectionName).then(setItems).catch(() => setItems([])); }, [sectionName]);
  if (items.length === 0) return <Typography variant="body2">No hay noticias publicadas en esta sección.</Typography>;
  return (
    <Stack spacing={2}>
      {items.map((n) => (
        <Card key={n.id}>
          <CardActionArea onClick={() => navigate(`/noticia/${n.id}`)}>
            <CardContent>
              <Typography variant="h6">{n.title}</Typography>
              <Typography variant="body2" color="text.secondary">{n.subtitle}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
};

export default Home;
