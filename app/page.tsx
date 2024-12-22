import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Share2, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='flex flex-col min-h-screen bg-black text-gray-300'>
      <header className='border-b border-gray-800'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <Code className='h-6 w-6 text-purple-500' />
            <span className='text-xl font-bold text-white'>CodeShare</span>
          </Link>
          <nav className='space-x-4'>
            <Link
              href='/explore'
              className='text-sm hover:text-purple-400 transition-colors'
            >
              Explore
            </Link>
            <Link
              href='/pricing'
              className='text-sm hover:text-purple-400 transition-colors'
            >
              Pricing
            </Link>
            <Link
              href='/login'
              className='text-sm hover:text-purple-400 transition-colors'
            >
              Log in
            </Link>
            <Button
              size='sm'
              variant='secondary'
              className='bg-purple-600 hover:bg-purple-700 text-white'
            >
              <Link href='/share'>Start Sharing</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className='flex-grow'>
        <section className='bg-gradient-to-r from-purple-900 to-black text-white py-20'>
          <div className='container mx-auto px-4 text-center'>
            <h1 className='text-4xl font-bold mb-4'>
              Share Your Code with the World
            </h1>
            <p className='text-xl mb-8'>
              Collaborate, learn, and showcase your projects on CodeShare
            </p>
            <div className='flex justify-center space-x-4'>
              <Button
                size='lg'
                variant='secondary'
                className='bg-purple-600 hover:bg-purple-700 text-white'
              >
                <Link href='/share'>Get Started</Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-purple-400 bg-purple-400 text-black transition-colors'
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className='py-20 bg-gray-900'>
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-12 text-white'>
              Why Choose CodeShare?
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <FeatureCard
                icon={<Share2 className='h-10 w-10' />}
                title='Easy Sharing'
                description='Share your code snippets and projects with a single click.'
              />
              <FeatureCard
                icon={<Users className='h-10 w-10' />}
                title='Collaboration'
                description='Work together with developers from around the world.'
              />
              <FeatureCard
                icon={<Zap className='h-10 w-10' />}
                title='Instant Feedback'
                description='Get real-time comments and suggestions on your code.'
              />
            </div>
          </div>
        </section>

        <section className='bg-black py-20'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl font-bold mb-8 text-white'>
              Join Our Community Today
            </h2>
            <p className='text-xl mb-8'>
              Stay updated with the latest features and community highlights.
            </p>
            <form className='flex justify-center max-w-md mx-auto'>
              <Input
                type='email'
                placeholder='Enter your email'
                className='rounded-r-none bg-gray-800 text-white border-gray-700 focus:border-purple-500'
              />
              <Button
                type='submit'
                className='rounded-l-none bg-purple-600 hover:bg-purple-700 text-white'
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className='bg-gray-900 text-gray-400 py-8 border-t border-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4 text-white'>Product</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/features'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href='/pricing'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href='/docs'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4 text-white'>Company</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/about'
                    className='hover:text-purple-400 transition-colors'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='/blog'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href='/careers'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4 text-white'>
                Resources
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/community'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href='/support'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href='/status'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4 text-white'>Legal</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/privacy'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='/terms'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href='/cookies'
                    className='hover:text-purple-400 transition-colors'
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-gray-800 text-center'>
            <p>
              &copy; {new Date().getFullYear()} CodeShare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='bg-black p-6 rounded-lg shadow-md text-center border border-gray-800'>
      <div className='text-purple-500 mb-4 flex justify-center'>{icon}</div>
      <h3 className='text-xl font-semibold mb-2 text-white'>{title}</h3>
      <p className='text-gray-400'>{description}</p>
    </div>
  );
}
