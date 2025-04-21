import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { AuthContext } from '../security/AuthContext';

// Test rendering navbar for logged out users
test('renders navbar with login and register for logged out users', () => {
  render(
    <MemoryRouter initialEntries={['/events']}>
      <AuthContext.Provider value={{ user: null }}>
        <NavBar>
          <div>Test Content</div>
        </NavBar>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  
  // Navbar should be visible on /events path
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
  expect(screen.getByText(/register/i)).toBeInTheDocument();
  expect(screen.getByText(/all events/i)).toBeInTheDocument();
  
  // Children should be rendered
  expect(screen.getByText(/test content/i)).toBeInTheDocument();
}); 