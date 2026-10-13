import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    showToast('Your message has been received! Our concierge team will reply within 4 hours.', 'success');
  };

  const faqs = [
    {
      q: 'How long does delivery take across India?',
      a: 'We ship all orders via priority express air courier (BlueDart & Delhivery). Metro cities receive deliveries within 48 to 72 hours, while other regional destinations take between 3 to 5 business days.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer a complimentary 7-day doorstep return and exchange policy. Simply visit your YASHU Account > Orders tab to initiate a return. Our courier collects the package with zero return shipping fees.',
    },
    {
      q: 'Are all YASHU products authentic with warranties?',
      a: 'Absolutely. Every piece is directly sourced from our ateliers and verified with an individual serial certificate. All timepieces and electronics include a comprehensive 2-year warranty.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major UPI applications (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, Net Banking, and Cash on Delivery (COD) across all serviceable PIN codes.',
    },
    {
      q: 'How do I track my active shipment?',
      a: 'Once your package departs our atelier, you will receive an automated SMS and email containing your live courier tracking link. You can also view real-time progress anytime under Account > Order History.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
          Concierge Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-display">
          We Are Here To Assist You
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed">
          Whether you require sizing guidance, styling consultation, or order status assistance,
          our dedicated atelier team is at your service.
        </p>
      </div>

      {/* Contact Cards & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Direct Contact Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider font-display border-b border-neutral-100 pb-3">
              Direct Channels
            </h3>

            <div className="space-y-5 text-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Phone className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Telephone Helpline</h4>
                  <p className="text-neutral-500 mt-0.5">+91 1800 210 9274 (Toll-Free)</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Monday to Saturday: 9:00 AM – 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Mail className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Email Inquiries</h4>
                  <p className="text-neutral-500 mt-0.5">concierge@yashu-store.com</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Average response turnaround: under 4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <MapPin className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Atelier Studio & Head Office</h4>
                  <p className="text-neutral-500 mt-0.5">
                    Level 8, Palladium Grand Tower, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                  <Clock className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">Private Studio Appointments</h4>
                  <p className="text-neutral-500 mt-0.5">
                    Private bespoke tailoring appointments available by prior reservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider font-display mb-1">
              Send An Atelier Dispatch
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Complete the dispatch form below and our client care officer will respond directly.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-950 font-display">
                  Message Dispatched Successfully
                </h4>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name}. We have logged ticket #{Math.floor(10000 + Math.random() * 90000)} and
                  will reply to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 text-xs font-bold text-emerald-900 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Yashu Verma"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Subject / Concern *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Sizing query for Wool Blazer / Order Tracking"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our concierge assist your requirements today?"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-neutral-50 rounded-3xl p-6 sm:p-12 border border-neutral-200/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Instant Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-neutral-200/80">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm font-bold text-neutral-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-neutral-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
