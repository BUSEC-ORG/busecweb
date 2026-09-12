"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, ShieldCheck, Send, GraduationCap, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// TODO: replace these with your actual hosted brochure file URLs
const STUDENT_BROCHURE_URL = "/brochures/BIC_7.0_Student_Sponsorship_Package.pdf";
const NON_STUDENT_BROCHURE_URL = "/brochures/BUSEC_2026_Sponsorship_Partnership_Package.pdf";

export default function Partners() {
  const [audience, setAudience] = useState<"student" | "nonstudent">("nonstudent");

  const nonStudentPackages = [
    {
      name: "Platinum Partner",
      amount: "₦1,000,000",
      features: [
        "Recognized as the Headline Sponsor of Babcock Innovation Challenge 7.0",
        "Logo prominently featured on all event materials (posters, flyers, banners, social media, website)",
        "Exclusive speaking opportunity (Keynote or Panel Session)",
        "Brand mention in all press releases and media coverage",
        "Exhibition booth space for product display",
        "Access to attendee database (with consent) for post-event engagement",
        "Dedicated social media campaign",
        "Opportunity to distribute branded merchandise to attendees",
        "Brand logo on event backdrop and Grand Finale stage",
        "Right to sponsor a specific prize category (e.g. \"[Brand] Award for Best Innovation\")",
        "First right of refusal to headline BIC 8.0",
        "Exclusive digital & campus media exposure via BUSEC's TikTok creator network and newsletter (15,000+ students/staff)"
      ],
      color: "border-busec-blue bg-busec-yellow/10",
      badge: "Highest Tier"
    },
    {
      name: "Gold Partner",
      amount: "₦500,000",
      features: [
        "Recognized as an Official Sponsor of Babcock Innovation Challenge 7.0",
        "Logo featured on major marketing materials and event banners",
        "Panel speaking opportunity or moderated session participation",
        "Exhibition booth space for product display",
        "Brand mention across social media promotions",
        "Opportunity to include branded materials in attendee welcome packs",
        "Brand recognition at all stages of the competition",
        "Logo placement on the official newsletter (15,000+ recipients)",
        "Two complimentary invitations to the Grand Finale VIP section"
      ],
      color: "border-slate-300 bg-slate-50",
      badge: "Popular"
    },
    {
      name: "Silver Partner",
      amount: "₦300,000",
      features: [
        "Recognized as a Supporting Sponsor",
        "Logo featured on selected event materials",
        "2 complimentary event passes",
        "2 dedicated social media mentions",
        "Opportunity to engage students during networking sessions",
        "Brand acknowledgement during the event",
        "Inclusion in the post-event sponsor recognition post"
      ],
      color: "border-amber-500/20 bg-amber-50/20",
      badge: "Standard"
    },
    {
      name: "Bronze Partner",
      amount: "₦250,000",
      features: [
        "Recognized as a Supporting Sponsor of Babcock Innovation Challenge 7.0",
        "Logo included on the sponsors' wall/roll-up banner at the Grand Finale",
        "1 dedicated social media mention",
        "1 complimentary event pass to the Grand Finale",
        "Brand acknowledgement during opening/closing remarks",
        "Opportunity to place branded flyers or merchandise at the registration desk"
      ],
      color: "border-slate-200 bg-white",
      badge: "Entry Tier"
    }
  ];

  const studentPackages = [
    {
      name: "Platinum Partner",
      amount: "₦50,000",
      features: [
        "Branded mini-booth/display table at the Grand Finale to showcase your product or service",
        "Name & logo on the student innovators wall at the venue",
        "Dedicated social media brand mention on BUSEC platforms",
        "Exclusive networking access with founders, entrepreneurs, mentors, and judges",
        "Guaranteed speaking slot during a networking break to pitch your business",
        "Official BUSEC Certificate of Support",
        "Event-day brand content: professional photos/videos for your own platforms",
        "Official \"BIC 7.0 Student Backer\" public recognition"
      ],
      color: "border-busec-blue bg-busec-yellow/10",
      badge: "Highest Tier"
    },
    {
      name: "Gold Partner",
      amount: "₦30,000",
      features: [
        "Dedicated mention on BUSEC's Instagram/TikTok Stories during BIC 7.0 event week",
        "Official BUSEC Certificate of Support",
        "Acknowledgement during a designated sponsor recognition segment at the Grand Finale",
        "Shared exhibition table space at the Grand Finale to showcase products/services",
        "Opportunity to connect with student entrepreneurs and the Babcock innovation community",
        "Early notifications for selected BUSEC opportunities, competitions, and workshops"
      ],
      color: "border-slate-300 bg-slate-50",
      badge: "Popular"
    },
    {
      name: "Silver Partner",
      amount: "₦20,000",
      features: [
        "Business name featured on the official sponsor/supporter slides during the Grand Finale",
        "Official BUSEC Certificate of Support",
        "Brief opportunity to introduce yourself and your business during a networking moment",
        "One branded story featuring your business during BIC 7.0 week",
        "Early notifications for selected BUSEC opportunities, competitions, and workshops"
      ],
      color: "border-amber-500/20 bg-amber-50/20",
      badge: "Standard"
    }
  ];

  const activePackages = audience === "student" ? studentPackages : nonStudentPackages;
  const activeBrochureUrl = audience === "student" ? STUDENT_BROCHURE_URL : NON_STUDENT_BROCHURE_URL;

  const [partnerType, setPartnerType] = useState<"Student" | "Non-Student">("Non-Student");
  const [partnerForm, setPartnerForm] = useState({
    org: "",
    contact: "",
    email: "",
    phone: "",
    matricNumber: "",
    department: "",
    level: "100L",
    tier: "Platinum Partner",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const levelOptions = ["100L", "200L", "300L", "400L", "500L", "600L", "Postgraduate"];

  const studentTierOptions = ["Platinum Partner", "Gold Partner", "Silver Partner"];
  const nonStudentTierOptions = ["Platinum Partner", "Gold Partner", "Silver Partner", "Bronze Partner"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!partnerForm.contact || !partnerForm.email || !partnerForm.phone) {
      setFormError("Please fill in your name, email, and phone number.");
      return;
    }

    if (partnerType === "Student") {
      if (!partnerForm.matricNumber || !partnerForm.department) {
        setFormError("Please fill in your matric number and department.");
        return;
      }
    } else {
      if (!partnerForm.org) {
        setFormError("Please fill in your organization name.");
        return;
      }
    }

    setFormLoading(true);

    const record = {
      partner_type: partnerType,
      org_or_brand_name: partnerForm.org || null,
      full_name: partnerForm.contact,
      email: partnerForm.email,
      phone: partnerForm.phone,
      matric_number: partnerType === "Student" ? partnerForm.matricNumber : null,
      department: partnerType === "Student" ? partnerForm.department : null,
      level: partnerType === "Student" ? partnerForm.level : null,
      tier: partnerForm.tier,
      message: partnerForm.message || null,
      status: "New"
    };

    if (supabase) {
      try {
        const { error } = await supabase.from("partner_requests").insert(record);
        if (error) {
          console.error("Supabase insertion error:", error);
          // Don't block the user — fall through to local cache and still show success
        }
      } catch (err) {
        console.error("Failed to write to Supabase:", err);
      }
    }

    // Local fallback cache
    try {
      const existingJson = localStorage.getItem("busec_partner_requests");
      const existing = existingJson ? JSON.parse(existingJson) : [];
      existing.unshift({ ...record, date: new Date().toLocaleDateString() });
      localStorage.setItem("busec_partner_requests", JSON.stringify(existing));
    } catch (err) {
      console.error("localStorage error:", err);
    }

    setFormLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-10 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-busec-blue/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center z-10 space-y-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-busec-navy tracking-tight leading-none max-w-4xl mx-auto">
            Partner with BUSEC
          </h1>
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto font-light leading-relaxed">
            Support campus entrepreneurship, recruit elite technical talent, and position your brand at the headquarters of student innovation.
          </p>
        </div>
      </section>

      {/* Partners List / Logos */}
      <section className="pt-10 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-busec-navy tracking-tight">Our Strategic Alliance</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              We collaborate with corporate tech providers, local financial systems, and venture networks to accelerate our projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-3 hover:-translate-y-1 transition-all duration-200">
              <h3 className="font-display font-bold text-lg text-slate-800">Sponsors</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Providing financial grants, cash prizes, and capital support for the Babcock Innovation Challenge.
              </p>
              <span className="text-xs font-semibold text-busec-blue block pt-2">Gadget Cartel</span>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-3 hover:-translate-y-1 transition-all duration-200">
              <h3 className="font-display font-bold text-lg text-slate-800">Strategic Partners</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Providing digital credits, hosting sandboxes, workshop speakers, and educational resources.
              </p>
              <span className="text-xs font-semibold text-busec-blue block pt-2">Supabase, ALX Nigeria, TechHub Guild</span>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-3 hover:-translate-y-1 transition-all duration-200">
              <h3 className="font-display font-bold text-lg text-slate-800">Alumni Partners</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Mentoring our student teams, offering internships, and seed incubating high-potential projects.
              </p>
              <span className="text-xs font-semibold text-busec-blue block pt-2">ArtLink, DuesPay Networks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages Tiers */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-busec-navy tracking-tight">Sponsorship Packages</h2>
              <p className="text-sm text-slate-550 leading-relaxed font-light">
                Choose a structured sponsorship blueprint to support our events and validate your brand on campus.
              </p>
            </div>
            <a
              href={activeBrochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-6 py-3 bg-white border border-slate-200 text-xs font-bold text-busec-blue rounded-xl hover:bg-slate-100 hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download {audience === "student" ? "Student" : "Corporate"} Brochure</span>
            </a>
          </div>

          {/* Student / Non-Student Toggle */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <button
                onClick={() => setAudience("nonstudent")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  audience === "nonstudent"
                    ? "bg-busec-yellow text-busec-navy border border-busec-blue shadow-md shadow-busec-yellow/15"
                    : "text-slate-500 hover:text-busec-blue"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Corporate / Non-Student</span>
              </button>
              <button
                onClick={() => setAudience("student")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  audience === "student"
                    ? "bg-busec-yellow text-busec-navy border border-busec-blue shadow-md shadow-busec-yellow/15"
                    : "text-slate-500 hover:text-busec-blue"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Partner</span>
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${audience === "nonstudent" ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-8`}>
            {activePackages.map((pkg, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl border ${pkg.color} bg-white card-shadow flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-200`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded">
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-350">0{idx + 1}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-800 mt-6">{pkg.name}</h3>
                  <span className="font-display font-black text-2xl text-busec-blue block mt-2">{pkg.amount}</span>

                  <ul className="space-y-3 mt-8 text-xs text-slate-600 leading-normal font-light">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2">
                        <ShieldCheck className="w-4 h-4 text-busec-blue flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner Form */}
      <section className="pt-10 pb-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Become a Partner</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto font-light">
              Tell us who you are, and we'll reach out to coordinate the right partnership tier for you.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-center font-semibold text-sm">
              Request received! Thank you, {partnerForm.contact}. We will reach out to you via {partnerForm.email} or {partnerForm.phone} shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow space-y-6">

              {/* Partner Type Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">I am registering as a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPartnerType("Non-Student")}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      partnerType === "Non-Student"
                        ? "bg-busec-yellow text-busec-navy border-busec-blue"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Non-Student / Organization</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerType("Student")}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      partnerType === "Student"
                        ? "bg-busec-yellow text-busec-navy border-busec-blue"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>
                </div>
              </div>

              {/* Non-Student: Organization Name */}
              {partnerType === "Non-Student" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={partnerForm.org}
                    onChange={(e) => setPartnerForm({ ...partnerForm, org: e.target.value })}
                    placeholder="e.g. Paystack Inc."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
              )}

              {/* Student-only: Business/Brand Name (optional) */}
              {partnerType === "Student" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Business/Brand Name <span className="normal-case font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={partnerForm.org}
                    onChange={(e) => setPartnerForm({ ...partnerForm, org: e.target.value })}
                    placeholder="e.g. your side-hustle or brand name, if any"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={partnerForm.contact}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contact: e.target.value })}
                    placeholder="e.g. Kola Aina"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    placeholder="e.g. 08123456789"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {partnerType === "Student" ? "Email Address" : "Corporate Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  placeholder={partnerType === "Student" ? "e.g. samuel@babcock.edu.ng" : "e.g. partnerships@paystack.com"}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                />
              </div>

              {/* Student-only fields */}
              {partnerType === "Student" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Matric Number</label>
                    <input
                      type="text"
                      required
                      value={partnerForm.matricNumber}
                      onChange={(e) => setPartnerForm({ ...partnerForm, matricNumber: e.target.value })}
                      placeholder="e.g. 23/0488"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Department</label>
                    <input
                      type="text"
                      required
                      value={partnerForm.department}
                      onChange={(e) => setPartnerForm({ ...partnerForm, department: e.target.value })}
                      placeholder="e.g. Software Engineering"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Level</label>
                    <select
                      value={partnerForm.level}
                      onChange={(e) => setPartnerForm({ ...partnerForm, level: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    >
                      {levelOptions.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Target Tier</label>
                <select
                  value={partnerForm.tier}
                  onChange={(e) => setPartnerForm({ ...partnerForm, tier: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                >
                  {(partnerType === "Student" ? studentTierOptions : nonStudentTierOptions).map((tier) => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Collaboration Goals</label>
                <textarea
                  rows={4}
                  value={partnerForm.message}
                  onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                  placeholder="Outline how you would like to support BUSEC (e.g. judging, mentorship, seed grants)..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all resize-none"
                ></textarea>
              </div>

              {formError && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-4 bg-busec-yellow text-busec-navy border border-busec-blue font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 hover:bg-busec-navy hover:text-white transition-all shadow-md shadow-busec-yellow/10 disabled:opacity-60"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Partnership Proposal</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}