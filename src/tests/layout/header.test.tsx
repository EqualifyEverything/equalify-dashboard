import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Header } from '~/components/layout';
import { render, screen } from '../customRender';

expect.extend(toHaveNoViolations);

describe('Header Component', () => {
  it('renders all navigation links', () => {
    render(<Header />);
    ['Reports', 'Scans', 'Settings', 'My Account'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('is accessible', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
