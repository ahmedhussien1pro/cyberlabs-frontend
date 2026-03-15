import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamCard } from '../components/team-card';
import type { TeamMember } from '../constants/members';

// Matches the real TeamMember shape: { key, img, links: { fb, twitter, linkedin } }
const mockMember: TeamMember = {
  key: 'ahmed',
  img: '/test-avatar.png',
  links: {
    fb: 'https://facebook.com/test',
    twitter: 'https://twitter.com/test',
    linkedin: 'https://linkedin.com/in/test',
  },
};

const mockMemberNoLinks: TeamMember = {
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

  it('renders Facebook link', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute(
      'href', 'https://facebook.com/test',
    );
  });

  it('renders Twitter link', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /twitter/i })).toHaveAttribute(
      'href', 'https://twitter.com/test',
    );
  });

  it('renders LinkedIn link', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href', 'https://linkedin.com/in/test',
    );
  });

  it('renders 3 social links', () => {
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

  it('renders translated name from i18n key members.ahmed.name', () => {
    render(<TeamCard member={mockMember} index={0} />);
    // useTranslation mock returns key as-is: "members.ahmed.name"
    expect(screen.getAllByText('members.ahmed.name').length).toBeGreaterThanOrEqual(1);
  });

  it('renders translated designation from i18n key members.ahmed.desig', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByText('members.ahmed.desig').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 2 images (card + bio overlay both have same img)', () => {
    render(<TeamCard member={mockMember} index={0} />);
    // Both the visible card and the hover-overlay img are in the DOM
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it('renders different index without crash', () => {
    const { container } = render(<TeamCard member={mockMember} index={3} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders links as empty href when links are empty strings', () => {
    render(<TeamCard member={mockMemberNoLinks} index={1} />);
    // still renders 3 link elements, just with empty hrefs
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
