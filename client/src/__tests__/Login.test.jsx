jest.mock('../security/fetchWithAuth', () => ({
  post: jest.fn().mockImplementation((url, data) => {
    if (url === '/login') {
      return Promise.resolve({
        data: { 
          user: { 
            id: 1, 
            username: data.username 
          } 
        }
      });
    }
    return Promise.resolve({ data: {} });
  }),
  get: jest.fn().mockResolvedValue({ data: [] }),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../security/AuthContext';

test('renders login form elements', () => {
  const mockLogin = jest.fn();

  render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  // Check if form elements are rendered
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});
