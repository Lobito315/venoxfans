'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f8] dark:bg-[#1f1022] text-slate-900 dark:text-slate-100 antialiased font-[Plus_Jakarta_Sans,sans-serif]">
      <div className="flex h-full grow flex-col">

        {/* ── Top Navigation Bar ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#d948ef]/20 bg-[#f8f6f8]/80 dark:bg-[#1f1022]/80 backdrop-blur-md px-6 md:px-20 py-4">
          <div className="flex items-center gap-2 text-[#d948ef]">
            <span className="material-symbols-outlined text-3xl font-bold">diamond</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">VenoxFans</h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-slate-600 dark:text-slate-300 hover:text-[#d948ef] dark:hover:text-[#d948ef] transition-colors text-sm font-semibold" href="#creators">Creators</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-[#d948ef] dark:hover:text-[#d948ef] transition-colors text-sm font-semibold" href="#features">Features</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-[#d948ef] dark:hover:text-[#d948ef] transition-colors text-sm font-semibold" href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex h-10 items-center justify-center rounded-lg px-4 bg-[#d948ef]/10 text-[#d948ef] border border-[#d948ef]/20 text-sm font-bold hover:bg-[#d948ef]/20 transition-all">
              Log in
            </Link>
            <Link href="/signup" className="flex h-10 items-center justify-center rounded-lg px-5 bg-[#d948ef] text-white text-sm font-bold shadow-lg shadow-[#d948ef]/25 hover:brightness-110 transition-all">
              Get started
            </Link>
          </div>
        </header>

        <main className="flex-1">

          {/* ── Hero Section ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-20 py-16 md:py-24">
            <div className="flex flex-col gap-10 lg:flex-row items-center">

              {/* Left column */}
              <div className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d948ef]/10 px-3 py-1 text-xs font-bold text-[#d948ef]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d948ef] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d948ef]"></span>
                    </span>
                    A NEW ERA OF CONTENT
                  </div>
                  <h1 className="text-slate-900 dark:text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Connect with your{' '}
                    <span className="text-[#d948ef] italic">favorite</span>{' '}
                    creators
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                    The exclusive fan platform where premium content and direct connection come to life — no middlemen.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#d948ef] text-white text-base font-bold shadow-xl shadow-[#d948ef]/20 hover:scale-105 transition-transform">
                    Get started
                  </Link>
                  <Link href="/explore" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-slate-200 dark:border-[#d948ef]/20 bg-transparent text-slate-900 dark:text-white text-base font-bold hover:bg-slate-100 dark:hover:bg-[#d948ef]/10 transition-colors">
                    Explore
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    {[
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuCE1xplBpW38VKqhAUD9CRim-FPQFE-tDvqCewKOYhTqpZk-6LuQvkZndFmyvWsZYjAna3pt5uI9kzHi4H4DQ_Y9A6cOuAgyl33xPtdTU5FkWnciDVdDJ40cP_d4Ku-f5X6i7168M4LQdtH8NxLqs-xiLQ9wFNFNeHpUnLMOYC6lT3yQEHSVpokIK2jXnISWfy3kXON3L5dexTOSGayb_tOjUXdpNaJ2EjEOUFD_iIuHvgPLr1SmOBKc8m63dMqNjwA8hpzWqH2raM',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTegG1C3p7RjHdDZmlSuPeLNr95qrAPTD-9khauvnVCVLIGNyPPAM4gTWCYYuKcFVw_dEWWZYpbLT5jsFfZ68aW5MyYvs8fa1WSj7pYvbkLrD-bhqGOEYSltLjzvCut7Eo_Wuyxw2qfUEbgqdNnj06e6XEMDeOeDG_kW2UU0qi4aekUQa3Vo7BCYQB9YL1rj17dry8g-S7ij8fQhlm7dN0KK3kOwSzC-vz2m3xzo9wgFixUKT0I5ZXdJF0BX3Vhu8QvJCBju_sKgI',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaoikB9hCbXqqFrLVF-wLEXm5b5hoIVywhqLktGSdOD1e9LsFmloVKsnXgYY8vf50fd8awoxRCC_SH3_0JHzUAmn5zelAfprN04h52l4vbQfk9scBh-Ii6aNL_wW9ON_VCUkd_3BSpyhYJCwR9soNXJ_UA2RbGE-FUZ4GyeZ6QWk0hPkPWtczotSrQtpN3ciXVdZ2EiknE6AVdeYnTRh-tsu0AtLAmSInuIRIK9GQ1ZQrWr2M11jr_eYvWYSoMZ_PdGGnGQGrsgzk',
                    ].map((src, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-[#1f1022] bg-slate-800 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={`Creator ${i + 1}`} src={src} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="text-slate-900 dark:text-white font-bold">+10k</span> active creators
                  </p>
                </div>
              </div>

              {/* Right column — hero image */}
              <div className="w-full flex-1">
                <div
                  className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-[#d948ef]/10 border border-[#d948ef]/10"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-rpT4lpGU9uU-dvSrNTGt1wbqG7I689akyZRF96KbKgnkzzrhFmWPupAE3x83xaSA6uTq-OZypfQFzqaCWxBNsG5ufBIGGgd3spl3a6AN83jbzyeP3b7mEfYNpK6qeV0R3do6hWhIMC2vB1wMvkOL8jE6_kYyfvCNCgMeJFBdzsZjJYPIBjn5SYTLyVms0kNDFnri5opvGV2PXdP028uMx9fLV2O7QAAx0oAlsmuO0uxet0C4hjVA8TxvFPFkCTAvnKrvlbVbVTM")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f1022]/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#d948ef] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">play_circle</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Live content</p>
                        <p className="text-white/70 text-sm">Exclusive streams for VIP members</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
          {/* ── How It Works Section ── */}
          <section className="bg-white dark:bg-[#1f1022] py-24" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
              <div className="text-center mb-16">
                <h2 className="text-[#d948ef] font-bold tracking-widest uppercase text-sm mb-4">Start your journey</h2>
                <h3 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-extrabold tracking-tight">How it works</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting lines (desktop only) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#d948ef]/20 to-transparent -translate-y-full px-20"></div>
                
                {[
                  { step: '01', title: 'Create Profile', desc: 'Sign up in seconds and customize your creator page with your unique style.', icon: 'person_add' },
                  { step: '02', title: 'Upload Content', desc: 'Share photos, 4K videos, or start a live stream for your dedicated fans.', icon: 'cloud_upload' },
                  { step: '03', title: 'Earn & Grow', desc: 'Monetize through subscriptions, PPV, and tips with the lowest fees.', icon: 'payments' },
                ].map((item) => (
                  <div key={item.step} className="relative flex flex-col items-center text-center gap-6 z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#d948ef] text-white flex items-center justify-center shadow-xl shadow-[#d948ef]/30 font-black text-xl">
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Creators Section ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-20 py-16" id="creators">
            <div className="flex flex-col gap-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-[#d948ef] font-bold tracking-widest uppercase text-sm mb-4">Meet Our Creators</h2>
                <h3 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-extrabold tracking-tight">
                  Diverse talent, <span className="text-[#d948ef]">limitless</span> creativity
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-6 font-medium">
                  From fitness experts to digital artists, find the community that speaks to you. Support them directly and unlock exclusive experiences.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { name: 'Fitness', icon: 'fitness_center' },
                  { name: 'Lifestyle', icon: 'auto_awesome' },
                  { name: 'Gaming', icon: 'sports_esports' },
                  { name: 'Art', icon: 'palette' },
                  { name: 'Music', icon: 'music_note' },
                  { name: 'Cooking', icon: 'restaurant' },
                ].map((cat) => (
                  <div key={cat.name} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-200 dark:border-[#d948ef]/10 bg-white dark:bg-[#1f1022] hover:scale-105 transition-all cursor-pointer group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#d948ef]/10 text-[#d948ef] group-hover:bg-[#d948ef] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    </div>
                    <span className="font-bold text-sm">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Features Section ── */}
          <section className="bg-slate-100 dark:bg-[#d948ef]/5 py-24" id="features">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
              <div className="flex flex-col gap-12">
                <div className="max-w-2xl">
                  <h2 className="text-[#d948ef] font-bold tracking-widest uppercase text-sm mb-4">Why choose VenoxFans?</h2>
                  <h3 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    Take your experience to the next level
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mt-4 font-medium">
                    Everything you need to support your favorite creators in one place, powered by the best technology.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: 'workspace_premium',
                      title: 'Exclusive Content',
                      desc: "Access photos, videos and live streams you won't find anywhere else. 4K quality guaranteed.",
                    },
                    {
                      icon: 'chat_bubble',
                      title: 'Direct Messages',
                      desc: 'Talk one-on-one with your favorite creators and become part of their private community.',
                    },
                    {
                      icon: 'shield',
                      title: 'Secure Payments',
                      desc: 'Bank-grade encrypted transactions with complete anonymity on your billing statements.',
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-[#d948ef]/20 bg-white dark:bg-[#1f1022] p-8 hover:border-[#d948ef]/50 transition-all duration-300 shadow-sm"
                    >
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#d948ef]/10 text-[#d948ef] group-hover:bg-[#d948ef] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h4 className="text-slate-900 dark:text-white text-xl font-bold">{card.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Pricing Section ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-20 py-24" id="pricing">
            <div className="flex flex-col items-center gap-12">
              <div className="text-center max-w-3xl">
                <h2 className="text-[#d948ef] font-bold tracking-widest uppercase text-sm mb-4">Pricing & Model</h2>
                <h3 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black tracking-tight">
                  The most <span className="text-[#d948ef]">fair</span> model for creators
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-6 font-medium">
                  We believe in your success. That&apos;s why we only win when you do. No setup fees, no monthly subscriptions.
                </p>
              </div>

              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Creators */}
                <div className="relative group overflow-hidden rounded-3xl border-2 border-[#d948ef] bg-white dark:bg-[#1f1022] p-10 shadow-2xl shadow-[#d948ef]/10">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-8xl">trending_up</span>
                  </div>
                  <div className="flex flex-col gap-6 h-full">
                    <div>
                      <span className="bg-[#d948ef] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">For Creators</span>
                      <h4 className="text-3xl font-black mt-4">Free to Start</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-[#d948ef]">5%</span>
                      <span className="text-slate-500 font-bold italic">Flat commission</span>
                    </div>
                    <ul className="space-y-4 flex-grow">
                      {[
                        'Professional creator tools',
                        'HD/4K video streaming',
                        'Direct fan messaging',
                        'Instant payout availability',
                        'Advanced analytics & tracking'
                      ].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium">
                          <span className="material-symbols-outlined text-[#d948ef] text-lg">check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="flex items-center justify-center h-14 rounded-xl bg-[#d948ef] text-white font-black hover:scale-[1.02] transition-all shadow-lg shadow-[#d948ef]/20">
                      Become a Creator
                    </Link>
                  </div>
                </div>

                {/* For Fans */}
                <div className="relative group overflow-hidden rounded-3xl border border-slate-200 dark:border-[#d948ef]/20 bg-slate-50 dark:bg-[#d948ef]/5 p-10">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-8xl">favorite</span>
                  </div>
                  <div className="flex flex-col gap-6 h-full">
                    <div>
                      <span className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">For Fans</span>
                      <h4 className="text-3xl font-black mt-4">Support Directly</h4>
                    </div>
                    <div className="flex items-baseline gap-2 text-slate-400">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">Variable</span>
                      <span className="font-bold">prices</span>
                    </div>
                    <ul className="space-y-4 flex-grow">
                      {[
                        'Choose your subscription price',
                        'Unlock exclusive PPV posts',
                        'Tip your favorite creators',
                        'Secure & anonymous billing',
                        'Interact in private chats'
                      ].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium">
                          <span className="material-symbols-outlined text-slate-400 text-lg">radio_button_checked</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/explore" className="flex items-center justify-center h-14 rounded-xl border-2 border-slate-300 dark:border-[#d948ef]/20 text-slate-900 dark:text-white font-black hover:bg-white dark:hover:bg-white/5 transition-all">
                      Explore Creators
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA Creator Section ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-20 py-24">
            <div className="relative rounded-3xl overflow-hidden bg-[#d948ef] px-8 py-20 md:p-24 flex flex-col items-center text-center gap-8">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '200px' }}>rocket_launch</span>
              </div>
              <div className="flex flex-col gap-4 max-w-3xl z-10">
                <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Are you a talented creator?
                </h2>
                <p className="text-white/90 text-lg md:text-xl font-medium">
                  Join thousands of artists, models and specialists already monetizing their passion with the lowest commission on the market.
                </p>
              </div>
              <div className="z-10 w-full sm:w-auto">
                <Link href="/signup" className="w-full sm:w-auto min-w-[240px] flex items-center justify-center rounded-xl h-16 px-10 bg-white text-[#d948ef] text-lg font-bold shadow-2xl hover:bg-slate-50 transition-all hover:scale-105">
                  <span className="material-symbols-outlined mr-2">person_add</span>
                  Join as a Creator
                </Link>
              </div>
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="bg-white dark:bg-[#1f1022] border-t border-slate-200 dark:border-[#d948ef]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

              {/* Brand */}
              <div className="col-span-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[#d948ef]">
                  <span className="material-symbols-outlined text-2xl font-bold">diamond</span>
                  <h2 className="text-slate-900 dark:text-white text-lg font-extrabold tracking-tight">VenoxFans</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  The leading platform for exclusive content monetization and real connection between creators and fans.
                </p>
                <div className="flex gap-4">
                  {['public', 'share', 'alternate_email'].map((icon) => (
                    <a key={icon} className="text-slate-400 hover:text-[#d948ef] transition-colors" href="#">
                      <span className="material-symbols-outlined">{icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-6">Platform</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {[
                    ['Explore Creators', '/explore'],
                    ['How it works', '#how-it-works'],
                    ['Pricing & Commissions', '#pricing'],
                    ['Referral Program', '#'],
                  ].map(([label, href]) => (
                    <li key={label}><a className="hover:text-[#d948ef] transition-colors" href={href}>{label}</a></li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-6">Support</h4>
                <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                  {[
                    ['Help Center', '#'],
                    ['Safety & Trust', '#'],
                    ['Terms of Service', '/terms'],
                    ['Privacy Policy', '/privacy'],
                  ].map(([label, href]) => (
                    <li key={label}><a className="hover:text-[#d948ef] transition-colors" href={href}>{label}</a></li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-6">Newsletter</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Stay up to date with the latest news and top creators.</p>
                <div className="flex flex-col gap-2">
                  <input
                    className="h-10 rounded-lg border border-slate-200 dark:border-[#d948ef]/20 bg-slate-50 dark:bg-[#d948ef]/5 text-sm px-4 focus:ring-2 focus:ring-[#d948ef] focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="you@email.com"
                    type="email"
                  />
                  <button className="h-10 rounded-lg bg-[#d948ef] text-white text-sm font-bold hover:brightness-110 transition-all">
                    Subscribe
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-[#d948ef]/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                © 2024 VenoxFans Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <a className="hover:text-[#d948ef]" href="/cookies">Cookies</a>
                <a className="hover:text-[#d948ef]" href="#">Legal</a>
                <a className="hover:text-[#d948ef]" href="#">Contact</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
