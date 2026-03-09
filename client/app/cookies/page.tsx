import Link from 'next/link';

export default function CookiesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="glass p-10 rounded-3xl border border-white/10">
                <h1 className="text-4xl font-extrabold mb-8 gradient-text inline-block">Cookie Policy</h1>
                <p className="text-gray-400 mb-8 text-sm">Last Updated: March 2026</p>

                <article className="prose prose-invert max-w-none text-gray-300 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
                        <p>
                            Cookies are small text files placed on your device to collect standard internet log information and visitor behavior information. When you visit VenoxFans, we may collect information from you automatically through cookies or similar technology.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How Do We Use Cookies?</h2>
                        <p>
                            VenoxFans uses cookies in a range of ways to improve your experience on our platform, including:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Keeping you signed in (Session Management).</li>
                            <li>Understanding how you use our platform (Analytics).</li>
                            <li>Remembering your preferences (e.g., Theme selections).</li>
                            <li>Ensuring the security of the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Essential Cookies:</strong> Required to provide you with basic features like secure login and transactions. The platform cannot function properly without these.</li>
                            <li><strong>Functional Cookies:</strong> Allow us to remember your site preferences.</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how our users engage with the website (e.g., Google Analytics).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
                        <p>
                            You can set your browser not to accept cookies. However, in a few cases, some of our platform features (like remaining logged in or unlocking premium content) may not function properly as a result.
                        </p>
                    </section>

                </article>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        ← Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
