import React from 'react';
import { render } from '@testing-library/react';
import Share from './Share';

test('renders learn react link', () => {
  const { getByText } = render(<Share />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
