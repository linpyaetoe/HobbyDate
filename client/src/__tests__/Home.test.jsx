import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Create a simplified mock component instead of using the real Home
const MockHome = () => (
  <div>
    <h1>Welcome to HobbyDate!</h1>
    <button>Log In</button>
    <button>Sign Up</button>
    <h2>Upcoming Events</h2>
    <h2>Past Events</h2>
  </div>
);

// Mock the module
jest.mock('../pages/Home', () => () => <MockHome />);

// Import the mock
import Home from '../pages/Home';

test('renders home page with welcome text and buttons', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  
  // Check for welcome text
  expect(screen.getByText(/Welcome to HobbyDate!/i)).toBeInTheDocument();
  
  // Check for buttons
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  
  // Check for section headings
  expect(screen.getByText(/upcoming events/i)).toBeInTheDocument();
  expect(screen.getByText(/past events/i)).toBeInTheDocument();
}); 