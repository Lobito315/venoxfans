import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="glass p-10 rounded-3xl border border-white/10">
                <h1 className="text-4xl font-extrabold mb-8 gradient-text inline-block">Privacy Policy</h1>
                <p className="text-gray-400 mb-8 text-sm">Last Updated: March 2026</p>

                <article className="prose prose-invert max-w-none text-gray-300 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            When you use VenoxFans, we collect information that identifies you, including:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Account Information:</strong> Username, email address, password, and Date of Birth (for Creators).</li>
                            <li><strong>Financial Information:</strong> Payment methods and payout details (processed securely via our third-party payment providers).</li>
                            <li><strong>Usage Data:</strong> How you interact with the platform, elements you click, and IP addresses for security purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the collected information to:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Provide, operate, and maintain the VenoxFans platform.</li>
                            <li>Process transactions and send related information (confirmations, receipts).</li>
                            <li>Verify your identity where necessary (e.g., age verification for Creators).</li>
                            <li>Prevent fraud, enforce our Terms of Service, and protect users.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                        <p>
                            We do not sell your personal data. We may share information with:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Service providers (like payment processors and cloud hosting) who need the information to perform services on our behalf.</li>
                            <li>Law enforcement or regulatory authorities if legally required to do so.</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-400 italic">
                            Note: When you subscribe to a Creator, they may see your username and profile, but never your raw payment details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                        <p>
                            Depending on your location (e.g., GDPR, CCPA), you may have the right to request access to your data, request deletion, or object to certain processing. Contact our support team to exercise these rights.
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
