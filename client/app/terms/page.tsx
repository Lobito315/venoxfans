import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="glass p-10 rounded-3xl border border-white/10">
                <h1 className="text-4xl font-extrabold mb-8 gradient-text inline-block">Terms of Service</h1>
                <p className="text-gray-400 mb-8 text-sm">Last Updated: March 2026</p>

                <article className="prose prose-invert max-w-none text-gray-300 space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using VenoxFans ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform. We reserve the right to update these terms at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                        <p>
                            You must be at least 18 years of age to register as a Creator on VenoxFans and monetize content. Users accessing premium content or subscribing must also be of legal age to enter into a binding contract in their respective jurisdiction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Content Rules & Moderation</h2>
                        <p>
                            Creators retain ownership of their content but grant VenoxFans a worldwide, royalty-free license to host and display the content on the platform. The following content is strictly prohibited:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Illegal content or activities.</li>
                            <li>Non-consensual media.</li>
                            <li>Hate speech, harassment, or threats.</li>
                            <li>Copyrighted material for which you do not own the rights.</li>
                        </ul>
                        <p className="mt-2">
                            VenoxFans reserves the right to remove any content or suspend accounts that violate these rules.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Payments and Subscriptions</h2>
                        <p>
                            All payments for subscriptions, tips, and pay-per-view (PPV) content are final and non-refundable, except as required by law. Creators are responsible for setting their own prices, and VenoxFans will deduct a platform fee from all transactions before payout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
                        <p>
                            The platform is provided "as is" without warranties of any kind. VenoxFans does not guarantee the continuous, uninterrupted, or secure access to the platform, and will not be liable for any damages resulting from service interruptions or data loss.
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
