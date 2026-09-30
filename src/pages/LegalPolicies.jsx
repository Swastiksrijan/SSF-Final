import { useEffect } from "react";
import { CONTACT_INFO } from "../config/contact";

export default function LegalPolicies() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full bg-zinc-50 font-inria">
            <div className="max-w-4xl mx-auto pt-32 pb-20 px-4 space-y-12">

                {/* ================= HEADER ================= */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black text-zinc-900">
                        Legal Policies
                    </h1>
                    <p className="text-zinc-600">
                        Our commitment to transparency, data protection, and legal compliance
                    </p>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-10">

                    {/* 1. Privacy Policy */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">1. Privacy Policy</h2>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.1 Introduction</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Swastik Srijan Foundation ("SSF", "we", "us", or "our") is committed to protecting
                                the privacy and security of personal information of our donors, beneficiaries,
                                volunteers, and website visitors. This Privacy Policy outlines how we collect,
                                use, store, and protect your personal data in compliance with the Digital Personal
                                Data Protection Act, 2023 (DPDP Act) and other applicable Indian laws.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.2 Information We Collect</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We may collect the following types of personal information:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li><strong>Personal Identification Information:</strong> Name, contact number, email address, postal address, date of birth</li>
                                <li><strong>Financial Information:</strong> Donation history, payment details, PAN for tax exemption certificates</li>
                                <li><strong>Usage Data:</strong> Pages visited, time spent on website, browser type, IP address</li>
                                <li><strong>Communication Data:</strong> Inquiries, feedback, and correspondence with our organization</li>
                                <li><strong>Beneficiary Data:</strong> Information collected for program delivery and impact assessment</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.3 How We Use Your Information</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We use collected information for the following purposes:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Processing donations and issuing tax exemption certificates (80G receipts)</li>
                                <li>Responding to inquiries and providing information about our programs</li>
                                <li>Sending updates, newsletters, and impact reports to donors and supporters</li>
                                <li>Improving our website, services, and program delivery</li>
                                <li>Maintaining records for legal compliance and auditing purposes</li>
                                <li>Conducting research and analysis to enhance our social impact</li>
                                <li>Complying with legal obligations and government reporting requirements</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.4 Data Security</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect
                                your personal data against unauthorized access, disclosure, alteration, or destruction.
                                These measures include:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Regular security assessments and updates</li>
                                <li>Secure data storage with limited access to authorized personnel only</li>
                                <li>Secure disposal of data when no longer required</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.5 Data Sharing and Disclosure</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties.
                                We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations, court orders, or government requests</li>
                                <li>With trusted service providers who assist in our operations (subject to confidentiality agreements)</li>
                                <li>For statutory audits and regulatory reporting as required by law</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.6 Your Rights</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Under the DPDP Act, 2023, you have the following rights:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li><strong>Right to Access:</strong> Request access to your personal data we hold</li>
                                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
                                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
                                <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time</li>
                                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organization</li>
                                <li><strong>Right to Grievance Redressal:</strong> Raise concerns about data processing practices</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.7 Cookies and Tracking Technologies</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Our website may use cookies and similar tracking technologies to enhance user
                                experience and analyze site traffic. You can control cookie preferences through
                                your browser settings. Disabling cookies may affect certain website functionalities.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.8 Children's Privacy</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We do not knowingly collect personal data from children under 18 years of age
                                without verifiable parental consent. If you believe we have inadvertently collected
                                such information, please contact us immediately.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">1.9 Data Retention</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                We retain personal data only for as long as necessary to fulfill the purposes
                                outlined in this policy or as required by law. Financial records are maintained
                                for a minimum of 7 years as per Indian tax and accounting regulations.
                            </p>
                        </div>
                    </section>

                    {/* 2. Terms and Conditions */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">2. Terms and Conditions</h2>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.1 Acceptance of Terms</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                By accessing or using the Swastik Srijan Foundation website and services, you
                                agree to comply with and be bound by these Terms and Conditions. If you do not
                                agree with any part of these terms, please do not use our website or services.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.2 Use of Website</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Our website is intended to provide information about our programs, initiatives,
                                and impact. You agree to use the website only for lawful purposes and in a manner
                                that does not infringe upon the rights of others or restrict their use of the website.
                            </p>
                            <p className="text-zinc-600 leading-relaxed">
                                <strong>Prohibited Activities:</strong>
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Attempting to gain unauthorized access to our systems or networks</li>
                                <li>Transmitting malicious code, viruses, or harmful content</li>
                                <li>Engaging in any activity that disrupts or interferes with website functionality</li>
                                <li>Using automated systems to scrape or collect data without permission</li>
                                <li>Misrepresenting your identity or affiliation with SSF</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.3 Intellectual Property Rights</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                All content on this website, including text, images, logos, graphics, videos,
                                and software, is the property of Swastik Srijan Foundation or its content suppliers
                                and is protected by Indian and international copyright laws. Unauthorized use,
                                reproduction, or distribution of this content is strictly prohibited.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.4 Donations and Contributions</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                All donations made to SSF are voluntary and non-refundable except in cases of
                                technical errors or duplicate transactions. Donors are eligible for tax deductions
                                under Section 80G of the Income Tax Act, 1961, subject to applicable regulations.
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Tax exemption certificates (80G receipts) will be issued for eligible donations</li>
                                <li>Donations are used exclusively for charitable purposes as per our objectives</li>
                                <li>We reserve the right to use donations where they are most needed unless specified otherwise</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.5 Disclaimer of Warranties</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                The information provided on this website is for general informational purposes only.
                                While we strive to ensure accuracy, we make no warranties or representations about
                                the completeness, accuracy, reliability, or suitability of the information.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.6 Limitation of Liability</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Swastik Srijan Foundation shall not be liable for any direct, indirect, incidental,
                                consequential, or punitive damages arising from your use of or inability to use our
                                website or services, even if we have been advised of the possibility of such damages.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.7 Third-Party Links</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Our website may contain links to third-party websites for your convenience.
                                We are not responsible for the content, privacy practices, or terms of use of
                                these external sites. Accessing third-party links is at your own risk.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">2.8 Governing Law and Jurisdiction</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                These Terms and Conditions are governed by the laws of India. Any disputes arising
                                from these terms shall be subject to the exclusive jurisdiction of the courts in
                                Madhya Pradesh, India.
                            </p>
                        </div>
                    </section>

                    {/* 3. Refund and Cancellation Policy */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">3. Refund and Cancellation Policy</h2>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">3.1 General Policy</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Donations made to Swastik Srijan Foundation are generally non-refundable as they
                                are considered voluntary contributions towards our charitable activities. However,
                                we understand that errors may occur.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">3.2 Refund Eligibility</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                Refunds may be issued in the following circumstances:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Duplicate transactions due to technical errors</li>
                                <li>Incorrect donation amount charged due to payment gateway issues</li>
                                <li>Unauthorized transactions (subject to verification)</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">3.3 Refund Process</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                To request a refund, please contact us within 7 days of the transaction with:
                            </p>
                            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                                <li>Transaction ID and payment receipt</li>
                                <li>Reason for refund request</li>
                                <li>Supporting documentation (if applicable)</li>
                            </ul>
                            <p className="text-zinc-600 leading-relaxed">
                                Approved refunds will be processed within 14-21 business days to the original
                                payment method.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-zinc-800">3.4 Cancellation Policy</h3>
                            <p className="text-zinc-600 leading-relaxed">
                                For recurring donations or pledges, donors may cancel their commitment by
                                contacting us at least 7 days before the next scheduled payment. Amounts
                                already donated are non-refundable.
                            </p>
                        </div>
                    </section>

                    {/* 4. Data Breach Notification */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">4. Data Breach Notification Policy</h2>

                        <p className="text-zinc-600 leading-relaxed">
                            In the unlikely event of a personal data breach that may pose a risk to your rights
                            and freedoms, we will:
                        </p>
                        <ul className="list-disc ml-5 text-zinc-600 space-y-1">
                            <li>Notify the Data Protection Board of India as required by law</li>
                            <li>Inform affected individuals promptly via email or other appropriate means</li>
                            <li>Provide details about the nature of the breach and steps being taken</li>
                            <li>Offer guidance on protective measures you can take</li>
                            <li>Implement corrective actions to prevent future breaches</li>
                        </ul>
                    </section>

                    {/* 5. Grievance Redressal */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">5. Grievance Redressal Mechanism</h2>

                        <p className="text-zinc-600 leading-relaxed">
                            For any concerns, complaints, or queries regarding data protection, privacy,
                            or these policies, please contact our Data Protection Officer:
                        </p>
                        <div className="bg-zinc-50 p-4 rounded-lg mt-3">
                            <p className="text-zinc-700"><strong>Data Protection Officer</strong></p>
                            <p className="text-zinc-600">Swastik Srijan Foundation</p>
                            <p className="text-zinc-600">Email: {CONTACT_INFO.dataProtectionOfficer.email}</p>
                            <p className="text-zinc-600">Phone: {CONTACT_INFO.dataProtectionOfficer.phone}</p>
                            <p className="text-zinc-600 mt-2">
                                We are committed to resolving grievances within 30 days of receipt.
                            </p>
                        </div>
                    </section>

                    {/* 6. Policy Updates */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">6. Policy Updates</h2>

                        <p className="text-zinc-600 leading-relaxed">
                            We may update these policies periodically to reflect changes in our practices,
                            legal requirements, or organizational needs. Material changes will be communicated
                            through our website and, where appropriate, via email to registered users.
                        </p>
                        <p className="text-zinc-600 leading-relaxed">
                            <strong>Last Updated:</strong> January 2026
                        </p>
                    </section>

                    {/* 7. Legal Registration */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">7. Legal Registration Details</h2>

                        <div className="bg-zinc-50 p-4 rounded-lg">
                            <p className="text-zinc-700"><strong>Organization Name:</strong> Swastik Srijan Foundation</p>
                            <p className="text-zinc-700"><strong>Registration:</strong> Registered under the Madhya Pradesh Societies Registration Act, 1973</p>
                            <p className="text-zinc-700"><strong>Registration Number:</strong> 11448/13</p>
                            <p className="text-zinc-700"><strong>Year of Establishment:</strong> 2013</p>
                            <p className="text-zinc-700"><strong>80G Registration:</strong> Available for tax exemption on donations</p>
                            <p className="text-zinc-700"><strong>12A Registration:</strong> Registered for income tax exemption</p>
                        </div>
                    </section>

                    {/* 8. Contact Information */}
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold text-zinc-900">8. Contact Information</h2>

                        <p className="text-zinc-600 leading-relaxed">
                            For any questions, concerns, or requests regarding these policies:
                        </p>
                        <div className="bg-zinc-50 p-4 rounded-lg mt-3">
                            <p className="text-zinc-700"><strong>Swastik Srijan Foundation</strong></p>
                            <p className="text-zinc-600">Email: {CONTACT_INFO.primaryEmail}</p>
                            <p className="text-zinc-600">Website: www.swastiksrijan.org</p>
                            <p className="text-zinc-600">Address: {CONTACT_INFO.address.registered}</p>
                        </div>
                    </section>

                    <div className="border-t pt-6 mt-8">
                        <p className="text-sm text-zinc-500 italic">
                            📄 Note: These policies are designed to ensure transparency, legal compliance,
                            and protection of stakeholder rights. For detailed legal documents, please contact
                            our office directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
