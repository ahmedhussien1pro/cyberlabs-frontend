import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-background'>
      <div className='container px-4 py-8 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link to='/' className='text-2xl font-bold'>
              Cyber<span className='text-primary'>Labs</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              Learn cybersecurity through hands-on labs and interactive courses.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold'>Platform</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/labs'
                  className='text-muted-foreground hover:text-primary'>
                  Labs
                </Link>
              </li>
              <li>
                <Link
                  to='/courses'
                  className='text-muted-foreground hover:text-primary'>
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to='/paths'
                  className='text-muted-foreground hover:text-primary'>
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link
                  to='/leaderboard'
                  className='text-muted-foreground hover:text-primary'>
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/about'
                  className='text-muted-foreground hover:text-primary'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-muted-foreground hover:text-primary'>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to='/careers'
                  className='text-muted-foreground hover:text-primary'>
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to='/blog'
                  className='text-muted-foreground hover:text-primary'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-sm font-semibold'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/privacy'
                  className='text-muted-foreground hover:text-primary'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-muted-foreground hover:text-primary'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row'>
          <p className='text-sm text-muted-foreground'>
            © {currentYear} CyberLabs. All rights reserved.
          </p>

          <div className='flex items-center gap-4'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'>
              <Github className='h-5 w-5' />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'>
              <Twitter className='h-5 w-5' />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'>
              <Linkedin className='h-5 w-5' />
            </a>
            <a
              href='mailto:info@cyberlabs.com'
              className='text-muted-foreground hover:text-primary transition-colors'>
              <Mail className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
