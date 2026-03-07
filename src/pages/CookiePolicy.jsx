import { Link } from "@tanstack/react-router";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function CookiePolicy() {
    return (
        <div className="w-full font-inria bg-white">
            {/* ================= HERO ================= */}
            <PageHero
                image="/images/real/green-warriors-students.jpg"
                title="Cookie Policy"
                subtitle="How we use cookies to improve your experience."
                hindiSubtitle="कुकी नीति - हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग कैसे करते हैं।"
            />

            <div className="max-w-4xl mx-auto py-16 px-4">
                <p className="text-zinc-600 mb-8 font-medium">Last Updated: December 2025</p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                        <p className="text-zinc-600 leading-relaxed">
                            Cookies are small text files that are stored on your device when you visit our website. They help us ensure the website functions correctly, understand how visitors interact with our site, and improve your browsing experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                        <ul className="list-disc list-inside space-y-2 text-zinc-600 ml-4">
                            <li><strong className="text-black">Essential Cookies:</strong> Necessary for the website to function properly (e.g., secure donation processing).</li>
                            <li><strong className="text-black">Analytics Cookies:</strong> Help us understand visitor traffic and page usage to improve our content.</li>
                            <li><strong className="text-black">Functional Cookies:</strong> Remember your preferences, such as language settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Managing Cookies</h2>
                        <p className="text-zinc-600 leading-relaxed">
                            You can choose to disable cookies through your browser settings. However, please note that some features of our website may not function properly without them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
                        <p className="text-zinc-600 leading-relaxed">
                            If you have any questions about our Cookie Policy, please contact us at <span className="text-[#003366] font-bold">{CONTACT_INFO.primaryEmail}</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
