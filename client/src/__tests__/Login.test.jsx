jest.mock('../security/fetchWithAuth', () => ({
  post: jest.fn().mockResolvedValue({
    data: { user: { id: 1, username: 'testuser' } },
  }),
  get: jest.fn().mockResolvedValue({ data: [] }),
}));


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../security/AuthContext';

test('login form', async () => {
  const mockLogin = jest.fn();

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/username/i), {
    target: { value: 'testuser' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: '123' },
  });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
  expect(mockLogin).toHaveBeenCalledWith({
    id: 1,
    username: 'testuser',
  });
});
