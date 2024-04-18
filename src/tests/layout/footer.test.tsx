import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Footer } from '~/components/layout';
import { render, screen } from '../customRender';

expect.extend(toHaveNoViolations);

describe('Footer Component', () => {
  it('renders version information and links correctly', () => {
    render(<Footer />);
    expect(
      screen.getByText(
        /Equalify Web App - Version 0.1.0 \(Development Preview\)/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Report an Issue')).toHaveAttribute(
      'href',
      'https://github.com/equalifyEverything/v1/issues',
    );
    expect(screen.getByText('Accessibility Statement')).toHaveAttribute(
      'href',
      'https://github.com/EqualifyEverything/v1/blob/main/ACCESSIBILITY.md',
    );
  });
  it('is accessible', async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
