import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewsForm from '../NewsForm';

// Mock AuthContext to avoid Firebase network calls and provide a test user
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', email: 'test@example.com', role: 'editor' }, loading: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock services
vi.mock('../../services/storage', () => ({
  uploadFile: vi.fn().mockImplementation((_file: any, _prefix: any, onProgress: any) => {
    // simulate progress
    if (onProgress) onProgress(50);
    return Promise.resolve('https://example.com/image.jpg');
  })
}));

vi.mock('../../services/news', () => ({
  createNews: vi.fn().mockResolvedValue({}),
  updateNews: vi.fn().mockResolvedValue({}),
  changeNewsStatus: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/sections', () => ({
  listSections: vi.fn().mockResolvedValue([{ id: '1', name: 'Tecnología' }])
}));

describe('NewsForm', () => {
  it('renders form and validates required fields', async () => {
    render(
      <MemoryRouter>
        <NewsForm />
      </MemoryRouter>
    );

    // Title and content required: submit empty
    const submit = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/Título es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/Contenido es obligatorio/i)).toBeInTheDocument();
    });
  });
});
