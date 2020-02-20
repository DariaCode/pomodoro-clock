import React from 'react';
import { render } from '@testing-library/react';
import Pomodoro from './App';

test('renders learn react link', () => {
  const { getByText } = render(<Pomodoro />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
