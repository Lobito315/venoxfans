import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
          The Next Generation of Creator Economy
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Monetize your passion <br className="hidden md:block" />
          <span className="gradient-text">Like Never Before</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          VenoxFans is the ultimate platform for creators to share exclusive content, connect directly with fans, and build a sustainable income.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)] transform hover:scale-105">
            Become a Creator
          </Link>
          <Link href="/explore" className="glass hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-full transition-all">
            Explore Content
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything you need to succeed</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors border-purple-500/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-purple-400 text-2xl">
              💰
            </div>
            <h3 className="text-xl font-bold mb-3">Maximize Earnings</h3>
            <p className="text-gray-400">Keep up to 90% of your earnings. Sell subscriptions, pay-per-view messages, and receive tips.</p>
          </div>
          {/* Card 2 */}
          <div className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors border-pink-500/20">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6 text-pink-400 text-2xl">
              🔒
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Paywalls</h3>
            <p className="text-gray-400">Protect your premium content with state-of-the-art paywalls and DRM-protected media delivery.</p>
          </div>
          {/* Card 3 */}
          <div className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors border-blue-500/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 text-blue-400 text-2xl">
              📱
            </div>
            <h3 className="text-xl font-bold mb-3">Social Discovery</h3>
            <p className="text-gray-400">Grow your audience natively with our built-in social media style discovery algorithms and feeds.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 mt-10 bg-gradient-to-t from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to take control of your audience?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of creators who are already making a living on VenoxFans.</p>
          <Link href="/signup" className="inline-block bg-white text-black hover:bg-gray-200 font-bold px-10 py-4 rounded-full transition-all transform hover:-translate-y-1">
            Start Earning Today
          </Link>
        </div>
      </section>
    </div>
  );
}
