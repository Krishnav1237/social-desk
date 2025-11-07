import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Your AI-Powered
              <br />
              <span className="text-accent-pink">Creator OS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Generate viral content, schedule posts, track analytics, and monetize your creativity—all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-primary-50"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white/10"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-primary-200 text-sm"
            >
              ✨ No credit card required • 100 free AI credits to start
            </motion.p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-accent-pink/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-900 mb-4">
            Everything you need to grow
          </h2>
          <p className="text-xl text-dark-600">
            Powerful tools designed for modern creators
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-dark-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to grow your audience?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of creators using AI to scale their content
          </p>
          <Link
            href="/auth/signup"
            className="btn-primary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-primary-50 inline-block"
          >
            Start Creating Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">SocialDesk</h3>
              <p className="text-dark-400">
                AI-powered creator operating system
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-dark-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-dark-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-dark-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-dark-800 text-center text-dark-400">
            <p>&copy; 2024 SocialDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '🤖',
    title: 'AI Caption Generator',
    description: 'Generate viral captions and hooks tailored to your unique style and voice.',
  },
  {
    icon: '📅',
    title: 'Smart Scheduler',
    description: 'Schedule posts across platforms with optimal timing recommendations.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Track performance with actionable insights and viral score predictions.',
  },
  {
    icon: '🛍️',
    title: 'Creator Marketplace',
    description: 'Buy and sell templates, presets, and digital products.',
  },
  {
    icon: '🤝',
    title: 'Brand Collabs',
    description: 'Connect with brands and manage partnership opportunities.',
  },
  {
    icon: '🎮',
    title: 'Gamification',
    description: 'Build streaks, earn rewards, and level up your creator journey.',
  },
];
