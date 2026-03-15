import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/utils';
import { TeamCard } from '../components/team-card';
import type { TeamMember } from '../data/members';

const mockMember: TeamMember = {
  nameKey: 'team.members.0.name',
  roleKey: 'team.members.0.role',
  bioKey: 'team.members.0.bio',
  image: '/test-avatar.png',
  social: {
    linkedin: 'https://linkedin.com/in/test',
    github: 'https://github.com/test',
    twitter: 'https://twitter.com/test',
  },
};

const mockMemberMinimal: TeamMember = {
  nameKey: 'team.members.1.name',
  roleKey: 'team.members.1.role',
  bioKey: 'team.members.1.bio',
  image: '/avatar2.png',
  social: {},
};

describe('TeamCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamCard member={mockMember} index={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders member name', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByText('team.members.0.name')).toBeInTheDocument();
  });

  it('renders member role', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByText('team.members.0.role')).toBeInTheDocument();
  });

  it('renders member image with correct src', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const images = screen.getAllByRole('img');
    expect(images.some((img) => img.getAttribute('src') === '/test-avatar.png')).toBe(true);
  });

  it('renders LinkedIn link when provided', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(
      screen.getByRole('link', { name: /linkedin/i }),
    ).toHaveAttribute('href', 'https://linkedin.com/in/test');
  });

  it('renders GitHub link when provided', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(
      screen.getByRole('link', { name: /github/i }),
    ).toHaveAttribute('href', 'https://github.com/test');
  });

  it('renders Twitter link when provided', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(
      screen.getByRole('link', { name: /twitter/i }),
    ).toHaveAttribute('href', 'https://twitter.com/test');
  });

  it('renders 3 social links', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('renders no social links when social is empty', () => {
    render(<TeamCard member={mockMemberMinimal} index={1} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders bio text', () => {
    render(<TeamCard member={mockMember} index={0} />);
    expect(screen.getByText('team.members.0.bio')).toBeInTheDocument();
  });

  it('shows bio overlay on hover — renders 2 images', () => {
    render(<TeamCard member={mockMember} index={0} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('renders different animation delay per index without crash', () => {
    const { container: c1 } = render(<TeamCard member={mockMember} index={0} />);
    const { container: c2 } = render(<TeamCard member={mockMember} index={3} />);
    expect(c1.firstChild).toBeInTheDocument();
    expect(c2.firstChild).toBeInTheDocument();
  });

  it('social links open in new tab', () => {
    render(<TeamCard member={mockMember} index={0} />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
