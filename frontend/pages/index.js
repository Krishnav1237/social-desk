import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                SocialDesk
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <Link href="#docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Docs
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section bg-gradient-subtle grid-pattern noise-texture">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-6 tracking-tight">
                The creator operating
                <br />
                system for social media
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered content generation, scheduling, analytics, and monetization.
              Everything you need to grow your audience in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/auth/signup" className="btn-primary">
                Start for free
              </Link>
              <Link href="#demo" className="btn-secondary">
                View demo
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 text-sm text-gray-500"
            >
              No credit card required · 100 free AI generations
            </motion.p>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 max-w-6xl mx-auto"
          >
            <div className="relative">
              <div className="aspect-[16/10] rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
                <div className="absolute inset-0 grid-pattern opacity-50"></div>
                {/* Placeholder for app screenshot */}
                <div className="relative h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 rounded-lg"></div>
                    <p className="text-sm">Product screenshot</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-gray-200">
        <div className="container-custom">
          <p className="text-center text-sm text-gray-500 mb-8">
            Trusted by creators at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
            {['Company', 'Brand', 'Studio', 'Agency', 'Creator'].map((name) => (
              <div key={name} className="text-xl font-semibold text-gray-900">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container-custom">
          <div className="max-w-3xl mb-20">
            <h2 className="mb-4">
              Everything you need
              <br />
              to grow your audience
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Stop juggling multiple tools. SocialDesk combines AI-powered content creation,
              scheduling, analytics, and monetization into one seamless platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="card-hover h-full">
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                      <span className="text-white text-lg">{feature.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="mb-4">How it works</h2>
            <p className="text-lg text-gray-600">
              From idea to published post in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-medium mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="aspect-[4/3] rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Visual {index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section border-y border-gray-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl font-semibold tracking-tight mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">
              Start growing today
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of creators using AI to scale their content and grow their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary text-lg px-8">
                Get started for free
              </Link>
              <Link href="#contact" className="btn-secondary text-lg px-8">
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">Changelog</a></li>
                <li><a href="#" className="hover:text-gray-900">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Partners</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
                <li><a href="#" className="hover:text-gray-900">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2024 SocialDesk. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Twitter</a>
              <a href="#" className="hover:text-gray-900">GitHub</a>
              <a href="#" className="hover:text-gray-900">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '✍️',
    title: 'AI Content Generation',
    description: 'Generate viral captions, hooks, and content tailored to your unique voice and style with advanced AI.',
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Schedule posts across all platforms with optimal timing recommendations based on your audience.',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Track performance, viral score predictions, and get actionable insights to grow your audience.',
  },
  {
    icon: '🎨',
    title: 'Template Marketplace',
    description: 'Access thousands of proven templates or sell your own to other creators in the marketplace.',
  },
  {
    icon: '🤝',
    title: 'Brand Partnerships',
    description: 'Connect with brands, manage collaborations, and monetize your influence seamlessly.',
  },
  {
    icon: '⚡',
    title: 'Multi-Platform',
    description: 'Manage Instagram, TikTok, Twitter, and more from one unified dashboard.',
  },
];

const steps = [
  {
    title: 'Connect your accounts',
    description: 'Link your social media accounts in seconds. We support Instagram, TikTok, Twitter, YouTube, and more.',
  },
  {
    title: 'Generate with AI',
    description: 'Upload your content and let AI generate captions, hooks, and variants optimized for each platform.',
  },
  {
    title: 'Schedule and publish',
    description: 'Review, schedule, and automatically publish your content at the optimal time for maximum engagement.',
  },
];

const stats = [
  { value: '10M+', label: 'Posts created' },
  { value: '50K+', label: 'Active creators' },
  { value: '98%', label: 'Satisfaction rate' },
];
