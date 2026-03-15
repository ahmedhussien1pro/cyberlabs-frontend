import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamCard } from '../components/team-card';
import type { TeamMember } from '../constants/members';

const mockMember: TeamMember = {
  key: 'ahmed',
  img: '/test-avatar.png',
  links: {
    fb: 'https://facebook.com/test',
    twitter: 'https://twitter.com/test',
    linkedin: 'https://linkedin.com/in/test',
  },
};

// Empty strings: <a href=""> is NOT accessible as role="link" per ARIA spec
const mockMemberEmptyLinks: TeamMember = {
  key: 'nasar',
  img: '/avatar2.png',
  links: { fb: '', twitter: '', linkedin: '' },
};

describe('TeamCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders member image with correct src', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const images = screen.getAllByRole('img');
    expect(images.some((img) => img.getAttribute('src') === '/test-avatar.png')).toBe(true);
  });

  it('renders Facebook link with correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute(
      'href', 'https://facebook.com/test',
    );
  });

  it('renders Twitter link with correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /twitter/i })).toHaveAttribute(
      'href', 'https://twitter.com/test',
    );
  });

  it('renders LinkedIn link with correct href', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href', 'https://linkedin.com/in/test',
    );
  });

  it('renders 3 accessible social links', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('all social links open in new tab', () => {
    render(<TeamCard member={mockMember} index={0} />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('all social links have rel=noopener noreferrer', () => {
    render(<TeamCard member={mockMember} index={0} />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders translated name via i18n key members.ahmed.name', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByText('members.ahmed.name').length).toBeGreaterThanOrEqual(1);
  });

  it('renders translated designation via i18n key members.ahmed.desig', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByText('members.ahmed.desig').length).toBeGreaterThanOrEqual(1);
  });

  it('renders at least 1 image in the DOM', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);
  });

  it('renders without crash for any index value', () => {
    const { container } = render(<TeamCard member={mockMember} index={3} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // <a href=""> is not accessible as role="link" per ARIA spec —
  // verify via aria-label attribute query instead
  it('renders 3 <a> elements even with empty hrefs', () => {
    const { container } = render(<TeamCard member={mockMemberEmptyLinks} index={1} />);
    expect(container.querySelectorAll('a')).toHaveLength(3);
  });
});
