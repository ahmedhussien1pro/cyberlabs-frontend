import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { render } from '@/test/utils';
import { ContactForm } from '../components/contact-form';

const mockMutate = vi.fn();
let mockIsPending = false;
let mockIsSuccess = false;

vi.mock('../hooks/use-contact', () => ({
  useContact: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
    isSuccess: mockIsSuccess,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending = false;
    mockIsSuccess = false;
  });

  it('renders without crashing', () => {
    const { container } = render(<ContactForm />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders name, email, subject, message field labels', () => {
    render(<ContactForm />);
    expect(screen.getByText('form.name')).toBeInTheDocument();
    expect(screen.getByText('form.email')).toBeInTheDocument();
    expect(screen.getByText('form.subject')).toBeInTheDocument();
    expect(screen.getByText('form.message')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactForm />);
    expect(screen.getByRole('button', { name: /form.submit/i })).toBeInTheDocument();
  });

  it('submit button is enabled by default', () => {
    render(<ContactForm />);
    expect(screen.getByRole('button', { name: /form.submit/i })).not.toBeDisabled();
  });

  it('submit button is disabled when isPending=true', () => {
    mockIsPending = true;
    render(<ContactForm />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading text when isPending=true', () => {
    mockIsPending = true;
    render(<ContactForm />);
    expect(screen.getByText('form.submitting')).toBeInTheDocument();
  });

  it('hides form fields when isSuccess=true', () => {
    mockIsSuccess = true;
    render(<ContactForm />);
    expect(screen.queryByText('form.name')).not.toBeInTheDocument();
  });

  it('mutate is NOT called on initial render (no user interaction)', () => {
    render(<ContactForm />);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('all 4 input placeholders are present', () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText('form.namePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form.emailPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form.subjectPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form.messagePlaceholder')).toBeInTheDocument();
  });

  it('calls mutate with correct values on valid submit', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByPlaceholderText('form.namePlaceholder'), 'Ahmed Ali');
    await user.type(screen.getByPlaceholderText('form.emailPlaceholder'), 'ahmed@test.com');
    await user.type(screen.getByPlaceholderText('form.subjectPlaceholder'), 'Test Subject');
    await user.type(screen.getByPlaceholderText('form.messagePlaceholder'), 'This is a test message body.');
    await user.click(screen.getByRole('button', { name: /form.submit/i }));
    await waitFor(() =>
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Ahmed Ali',
        email: 'ahmed@test.com',
        subject: 'Test Subject',
        message: 'This is a test message body.',
      }),
    );
  });
});
