jest.mock('../security/fetchWithAuth', () => ({
  post: jest.fn().mockResolvedValue({
    data: { message: 'Success' }
  })
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { AuthContext } from '../security/AuthContext';

// Simple test that just checks if the component renders without crashing
test('renders register form without crashing', () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <Register />
      </AuthContext.Provider>
    </BrowserRouter>
  );
  
  // Check if the register form renders
  expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
}); 