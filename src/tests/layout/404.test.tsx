import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import NotFound from '~/components/layout/404';
import { render, screen } from '../customRender';

expect.extend(toHaveNoViolations);

describe('NotFound Component', () => {
  it('renders correctly and contains expected content', () => {
    render(<NotFound />);
    expect(screen.getByText('404 Error')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go back to the homepage' }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByAltText(
        'Return to the homepage by clicking the Equalify logo',
      ),
    ).toBeInTheDocument();
  });
  it('is accessible', async () => {
    const { container } = render(<NotFound />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
