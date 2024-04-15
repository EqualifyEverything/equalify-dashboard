import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import Header from '~/components/layout/header';
import { render, screen } from '../customRender';

expect.extend(toHaveNoViolations);

describe('Header Component', () => {
  describe('with managedMode enabled', () => {
    it('renders all navigation links', () => {
      render(<Header managedMode={true} />);
      ['Reports', 'Scans', 'Settings', 'My Account'].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });

    it('is accessible with managedMode enabled', async () => {
      const { container } = render(<Header managedMode={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  describe('with managedMode disabled', () => {
    it('renders navigation links excluding My Account', () => {
      render(<Header managedMode={false} />);
      ['Reports', 'Scans', 'Settings'].forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
      expect(screen.queryByText('My Account')).toBeNull();
    });

    it('is accessible with managedMode disabled', async () => {
      const { container } = render(<Header managedMode={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
