import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import axios from 'axios';
import App from './App';

// Mockear la librería axios
jest.mock('axios');

describe('App Component', () => {
  const mockUsers = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone_number: '123-456-7890' },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone_number: '098-765-4321' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUsers });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el encabezado correctamente', () => {
    render(<App />);
    expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
  });

  it('debería cargar y mostrar usuarios de la API', async () => {
    render(<App />);

    // Espera a que los usuarios sean cargados y mostrados en la pantalla
    await waitFor(() => {
      mockUsers.forEach((user) => {
        expect(screen.getByText(`${user.first_name} ${user.last_name}`)).toBeInTheDocument();
        expect(screen.getByText(`Email: ${user.email}`)).toBeInTheDocument();
        expect(screen.getByText(`Teléfono: ${user.phone_number}`)).toBeInTheDocument();
      });
    });

    // Verifica que la función de llamada a la API fue invocada
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://random-data-api.com/api/v2/users?size=9&page=1');
  });

  it('debería mostrar el mensaje de fin cuando no hay más usuarios', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Mock para simular que no hay más usuarios

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No hay más usuarios para mostrar.')).toBeInTheDocument();
    });
  });

  it('debería mostrar el mensaje de cargando mientras los usuarios se están cargando', () => {
    render(<App />);
    
    // Dado que los usuarios están siendo cargados inicialmente, el mensaje de cargando debería estar presente
    expect(screen.getByText('Cargando más usuarios...')).toBeInTheDocument();
  });
});
