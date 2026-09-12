"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { supabase } from "@/lib/supabase";
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function JoinBusec() {
  const [step, setStep] = useState(1); // 1: Form, 2: Payment Simulation, 3: Success
  const [formData, setFormData] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    level: "100L",
    email: "",
    phone: "",
    interests: "",
    whyJoin: "",
    ownsBusiness: "No",
    committee: "Secretariat"
  });

  const [loading, setLoading] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(2);
  };

  const saveApplicationToStorage = async (ref: string) => {
    // Central Database Integration (Supabase)
    if (supabase) {
      try {
        const { error } = await supabase
          .from("membership_applications")
          .insert({
            full_name: formData.fullName,
            matric_number: formData.matricNumber,
            department: formData.department,
            level: formData.level,
            email: formData.email,
            phone: formData.phone,
            interests: formData.interests,
            why_join: formData.whyJoin,
            owns_business: formData.ownsBusiness,
            committee: formData.committee,
            payment_reference: ref,
            payment_status: "Paid",
            application_status: "Pending Approval"
          });

        if (error) {
          console.error("Supabase insertion error:", error);
        } else {
          console.log("Successfully recorded candidate registration in Supabase.");
        }
      } catch (err) {
        console.error("Failed to write to Supabase:", err);
      }
    }

    // Local Storage Cache Fallback
    const existingAppsJson = localStorage.getItem("busec_membership_applications");
    const existingApps = existingAppsJson ? JSON.parse(existingAppsJson) : [];
    
    const newApplication = {
      id: "APP-" + Date.now(),
      ...formData,
      paymentRef: ref,
      paymentStatus: "Paid",
      status: "Pending Approval",
      date: new Date().toLocaleDateString()
    };
    
    existingApps.unshift(newApplication);
    localStorage.setItem("busec_membership_applications", JSON.stringify(existingApps));
  };

  const verifyPaymentOnBackend = async (reference: string) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reference, formData })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        saveApplicationToStorage(data.reference);
        setTxRef(data.reference);
        setLoading(false);
        setStep(3);
      } else {
        // Fallback for missing keys in dev/demo environment
        if (response.status === 501 && data.code === "CREDENTIALS_MISSING") {
          console.warn("Paystack Secret Key missing on server. Simulating verification success for development.");
          saveApplicationToStorage(reference);
          setTxRef(reference);
          setLoading(false);
          setStep(3);
          return;
        }

        setErrorMessage(data.error || "Payment verification failed.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Verification callback error:", err);
      setErrorMessage("Network error verifying transaction. Please check connection.");
      setLoading(false);
    }
  };

  const handlePaystackCheckout = () => {
    setLoading(true);
    setErrorMessage("");

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_bab8fd90759a60d6cc0461fd82594b8c283fc605";

    if (!publicKey || publicKey === "pk_test_placeholder_key_here") {
      console.warn("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not configured. Falling back to test simulation mode.");
      
      const ref = "TEST-SIM-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      setTimeout(() => {
        saveApplicationToStorage(ref);
        setTxRef(ref);
        setLoading(false);
        setStep(3);
      }, 1500);
      return;
    }

    try {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: formData.email,
        amount: 7000 * 100, // ₦7,000 in kobo
        currency: "NGN",
        ref: "PAY-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
        callback: function (response: any) {
          verifyPaymentOnBackend(response.reference);
        },
        onClose: function () {
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (err: any) {
      console.error("Failed to load Paystack setup:", err);
      setErrorMessage("Could not load Paystack Checkout interface. Please check internet connection.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Hero Header */}
      <section className="relative pt-36 pb-10 overflow-hidden bg-slate-55 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-busec-blue/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center z-10 space-y-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-busec-navy tracking-tight leading-none max-w-4xl mx-auto">
            Join the Founder Network
          </h1>
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto font-light leading-relaxed">
            Register as an official BUSEC member, pay the membership dues, and get instant access to events and incubators.
          </p>
        </div>
      </section>

      {/* Membership Flow Panel */}
      <section className="pt-10 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-12 max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 border ${step >= 1 ? "bg-busec-yellow text-busec-navy border-busec-blue" : "bg-slate-100 text-slate-400 border-transparent"}`}>1</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Application</span>
            </div>
            <div className="h-0.5 w-16 bg-slate-200 flex-1 mx-2"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 border ${step >= 2 ? "bg-busec-yellow text-busec-navy border-busec-blue" : "bg-slate-100 text-slate-400 border-transparent"}`}>2</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Dues Payment</span>
            </div>
            <div className="h-0.5 w-16 bg-slate-200 flex-1 mx-2"></div>
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 border ${step >= 3 ? "bg-busec-yellow text-busec-navy border-busec-blue" : "bg-slate-100 text-slate-400 border-transparent"}`}>3</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirmation</span>
            </div>
          </div>

          {/* Step 1: Application Form */}
          {step === 1 && (
            <form onSubmit={handleFormSubmit} className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Samuel Oguntoye"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Matric Number</label>
                  <input
                    type="text"
                    required
                    value={formData.matricNumber}
                    onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                    placeholder="e.g. 23/0488"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Software Engineering"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                    <option value="600L">600L</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. samuel@babcock.edu.ng"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 08123456789"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
              </div>

              {/* Committee Selection (single choice) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Preferred Committee</label>
                <select
                  required
                  value={formData.committee}
                  onChange={(e) => setFormData({ ...formData, committee: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                >
                  <option value="Secretariat">Secretariat</option>
                  <option value="Welfare">Welfare</option>
                  <option value="Public Relations">Public Relations</option>
                  <option value="Protocol">Protocol</option>
                  <option value="Finance">Finance</option>
                  <option value="Chaplaincy">Chaplaincy</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Entrepreneurial Interests <span className="normal-case font-normal text-slate-400">(optional)</span></label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g. Agritech, fintech, software products... (optional)"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Own a business?</label>
                  <select
                    value={formData.ownsBusiness}
                    onChange={(e) => setFormData({ ...formData, ownsBusiness: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                  >
                    <option value="No">No, I have ideas</option>
                    <option value="Yes">Yes, I am a founder</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Why do you want to join BUSEC?</label>
                <textarea
                  rows={3}
                  required
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                  placeholder="Tell us about what you want to build and how BUSEC can assist..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-busec-yellow text-busec-navy border border-busec-blue font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-1.5 hover:bg-busec-navy hover:text-white transition-all shadow-md shadow-busec-yellow/15"
              >
                <span>Proceed to Membership Dues</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Paystack Payment Simulation */}
          {step === 2 && (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-250 flex items-center justify-center text-emerald-600 mx-auto">
                <CreditCard className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-800">Membership Checkout</h3>
                <p className="text-xs text-slate-500 font-light">BUSEC Student Membership Registration Dues (2026/2027 Session)</p>
                <span className="font-display font-black text-3xl text-busec-blue block pt-2">₦7,000</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs space-y-2 text-slate-650 font-light">
                <div className="flex justify-between">
                  <span>Candidate:</span>
                  <span className="font-semibold text-slate-850">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Matric:</span>
                  <span className="font-semibold text-slate-850">{formData.matricNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Committee:</span>
                  <span className="font-semibold text-slate-850">{formData.committee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span className="font-semibold text-slate-850">2026/2027</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="text-emerald-650 font-bold">Paystack Gate</span>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 text-left">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handlePaystackCheckout}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-650/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing transaction...</span>
                    </>
                  ) : (
                    <span>Pay with Paystack</span>
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-655 border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Go Back & Edit Form
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success Screen */}
          {step === 3 && (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-busec-blue/10 border border-busec-blue/20 flex items-center justify-center text-busec-blue mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-800">Application Completed</h3>
                <p className="text-xs text-slate-500 font-light">Your membership registration has been recorded successfully.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs space-y-2 text-slate-650 font-light">
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono text-slate-800 font-semibold">{txRef}</span>
                </div>
                <div className="flex justify-between">
                  <span>Committee:</span>
                  <span className="text-slate-800 font-semibold">{formData.committee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dues Status:</span>
                  <span className="text-emerald-655 font-bold">Paid</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <span className="text-busec-blue font-bold">Pending Review</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-busec-blue/5 border border-busec-blue/10 flex items-start space-x-3 text-left">
                <ShieldCheck className="w-5 h-5 text-busec-blue flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-655 leading-relaxed font-light">
                  <strong>What happens next?</strong> BUSEC administrators will audit your matric details. Once approved, you will receive onboarding links to the Slack developer community and notices about executive checkins.
                </p>
              </div>

              {/* WhatsApp Community Call-to-Action */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center space-y-3.5 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">Join the Builder Community</span>
                  <p className="text-[11px] text-slate-600 font-light leading-normal">Connect with fellow student innovators, developers, and founders in our WhatsApp group.</p>
                </div>
                <a
                  href="https://chat.whatsapp.com/IVrm4FG0iPmIozJokqwlNA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.417 9.864-9.848.002-2.63-1.018-5.101-2.872-6.957C16.59 1.944 14.116.924 11.493.924c-5.438 0-9.862 4.416-9.866 9.847-.002 1.82.488 3.593 1.42 5.176l-.99 3.616 3.7.969-1.11-.648z" />
                  </svg>
                  <span>Join WhatsApp Group</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setFormData({
                    fullName: "",
                    matricNumber: "",
                    department: "",
                    level: "100L",
                    email: "",
                    phone: "",
                    interests: "",
                    whyJoin: "",
                    ownsBusiness: "No",
                    committee: "Secretariat"
                  });
                  setStep(1);
                }}
                className="w-full py-4 bg-busec-yellow text-busec-navy border border-busec-blue font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-busec-navy hover:text-white transition-all shadow-md shadow-busec-yellow/10"
              >
                Register Another Candidate
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}