"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Loader2, Users } from "lucide-react";

// TODO: Replace with your actual BIC WhatsApp group invite link
const BIC_WHATSAPP_LINK = "https://chat.whatsapp.com/REPLACE_WITH_YOUR_BIC_GROUP_LINK";

type Member = {
  fullName: string;
  email: string;
  phone: string;
  matricNumber: string;
  department: string;
  level: string;
};

const emptyMember: Member = {
  fullName: "",
  email: "",
  phone: "",
  matricNumber: "",
  department: "",
  level: "100L"
};

export default function BicRegister() {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { ...emptyMember },
    { ...emptyMember },
    { ...emptyMember }
  ]);

  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeJudging, setAgreeJudging] = useState(false);
  const [consentContact, setConsentContact] = useState(false);

  const [referralSource, setReferralSource] = useState("Instagram");
  const [referralOther, setReferralOther] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [teamRef, setTeamRef] = useState("");

  // Auto-redirect to WhatsApp a few seconds after successful submission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = BIC_WHATSAPP_LINK;
      }, 4000); // redirects after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const updateMember = (idx: number, field: keyof Member, value: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    setMembers(updated);
  };

  const validateForm = () => {
    if (!teamName.trim()) return "Please enter a team name.";

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.fullName || !m.email || !m.phone || !m.matricNumber || !m.department) {
        return `Please complete all fields for Member ${i + 1}.`;
      }
    }

    if (!confirmAccurate || !agreeRules || !agreeJudging || !consentContact) {
      return "Please agree to all checkboxes before submitting.";
    }

    if (referralSource === "Other" && !referralOther.trim()) {
      return "Please tell us how you heard about BIC.";
    }

    return "";
  };

  const checkMembership = async (): Promise<string[]> => {
    // Returns list of matric numbers NOT found as paid BUSEC members
    if (!supabase) return []; // if supabase isn't configured, skip check (dev fallback)

    const matricNumbers = members.map((m) => m.matricNumber.trim());
    const notFound: string[] = [];

    try {
      const { data, error } = await supabase
        .from("membership_applications")
        .select("matric_number, payment_status")
        .in("matric_number", matricNumbers);

      if (error) {
        console.error("Membership check error:", error);
        return []; // don't block submission on a check failure
      }

      const paidMatrics = new Set(
        (data || [])
          .filter((row: any) => row.payment_status === "Paid")
          .map((row: any) => row.matric_number)
      );

      matricNumbers.forEach((mn) => {
        if (!paidMatrics.has(mn)) notFound.push(mn);
      });
    } catch (err) {
      console.error("Membership check failed:", err);
    }

    return notFound;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setShowJoinPrompt(false);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    const notFoundMatrics = await checkMembership();
    if (notFoundMatrics.length > 0) {
      setErrorMessage(
        `The following matric number(s) are not registered as paid BUSEC members: ${notFoundMatrics.join(
          ", "
        )}. All 3 team members must be BUSEC members before registering for BIC.`
      );
      setShowJoinPrompt(true);
      setLoading(false);
      return;
    }

    const ref = "BIC-" + Date.now();

    // Save to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from("bic_registrations").insert({
          team_name: teamName,
          team_ref: ref,
          member1_name: members[0].fullName,
          member1_email: members[0].email,
          member1_phone: members[0].phone,
          member1_matric: members[0].matricNumber,
          member1_department: members[0].department,
          member1_level: members[0].level,
          member2_name: members[1].fullName,
          member2_email: members[1].email,
          member2_phone: members[1].phone,
          member2_matric: members[1].matricNumber,
          member2_department: members[1].department,
          member2_level: members[1].level,
          member3_name: members[2].fullName,
          member3_email: members[2].email,
          member3_phone: members[2].phone,
          member3_matric: members[2].matricNumber,
          member3_department: members[2].department,
          member3_level: members[2].level,
          referral_source: referralSource === "Other" ? referralOther : referralSource,
          status: "Submitted"
        });

        if (error) {
          console.error("Supabase insertion error:", error);
          setErrorMessage("Something went wrong saving your registration. Please try again.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Failed to write to Supabase:", err);
        setErrorMessage("Network error. Please check your connection and try again.");
        setLoading(false);
        return;
      }
    }

    // Local fallback cache
    const existingJson = localStorage.getItem("busec_bic_registrations");
    const existing = existingJson ? JSON.parse(existingJson) : [];
    existing.unshift({
      teamName,
      members,
      referralSource: referralSource === "Other" ? referralOther : referralSource,
      ref,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem("busec_bic_registrations", JSON.stringify(existing));

    setTeamRef(ref);
    setLoading(false);
    setSubmitted(true);
  };

  const levelOptions = ["100L", "200L", "300L", "400L", "500L", "600L", "Postgraduate"];

  if (submitted) {
    return (
      <>
        <Navbar />
        <section className="pt-40 pb-24 bg-white">
          <div className="max-w-md mx-auto px-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-busec-blue/10 border border-busec-blue/20 flex items-center justify-center text-busec-blue mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-slate-800">🎉 BIC Registration Successful!</h3>
                <p className="text-xs text-slate-500 font-light">
                  Your team has been registered successfully for the Babcock Innovation Challenge.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs space-y-2 text-slate-650 font-light">
                <div className="flex justify-between">
                  <span>Team:</span>
                  <span className="font-semibold text-slate-850">{teamName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono text-slate-800 font-semibold">{teamRef}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-busec-blue font-bold">Submitted</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center text-center space-y-3.5 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">Join the BIC Group</span>
                  <p className="text-[11px] text-slate-600 font-light leading-normal">
                    You'll be redirected automatically in a few seconds, or tap below to join now.
                  </p>
                </div>
                <a
                  href={BIC_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.417 9.864-9.848.002-2.63-1.018-5.101-2.872-6.957C16.59 1.944 14.116.924 11.493.924c-5.438 0-9.862 4.416-9.866 9.847-.002 1.82.488 3.593 1.42 5.176l-.99 3.616 3.7.969-1.11-.648z" />
                  </svg>
                  <span>Join BIC WhatsApp Group</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-10 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center z-10 space-y-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-busec-navy tracking-tight leading-none max-w-4xl mx-auto">
            Register for BIC
          </h1>
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto font-light leading-relaxed">
            Teams of 3 registered BUSEC members. Fill in all details below to enter the Babcock Innovation Challenge.
          </p>
        </div>
      </section>

      <section className="pt-10 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-50 border border-slate-150 card-shadow space-y-10">

            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Team Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Team Ignite"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
              />
            </div>

            {/* Members */}
            {members.map((member, idx) => (
              <div key={idx} className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-busec-blue" />
                  <h3 className="font-display font-bold text-sm text-slate-800">Member {idx + 1}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={member.fullName}
                      onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Matric Number</label>
                    <input
                      type="text"
                      required
                      value={member.matricNumber}
                      onChange={(e) => updateMember(idx, "matricNumber", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                    <input
                      type="email"
                      required
                      value={member.email}
                      onChange={(e) => updateMember(idx, "email", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Phone</label>
                    <input
                      type="tel"
                      required
                      value={member.phone}
                      onChange={(e) => updateMember(idx, "phone", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Department</label>
                    <input
                      type="text"
                      required
                      value={member.department}
                      onChange={(e) => updateMember(idx, "department", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Level</label>
                    <select
                      value={member.level}
                      onChange={(e) => updateMember(idx, "level", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
                    >
                      {levelOptions.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Checkboxes */}
            <div className="space-y-3 p-5 rounded-2xl bg-white border border-slate-200">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-2">Terms & Consent</h3>

              <label className="flex items-start space-x-3 text-xs text-slate-650 font-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmAccurate}
                  onChange={(e) => setConfirmAccurate(e.target.checked)}
                  className="mt-0.5"
                />
                <span>I confirm that the information provided is accurate.</span>
              </label>

              <label className="flex items-start space-x-3 text-xs text-slate-650 font-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeRules}
                  onChange={(e) => setAgreeRules(e.target.checked)}
                  className="mt-0.5"
                />
                <span>I agree to the Babcock Innovation Challenge rules and guidelines.</span>
              </label>

              <label className="flex items-start space-x-3 text-xs text-slate-650 font-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeJudging}
                  onChange={(e) => setAgreeJudging(e.target.checked)}
                  className="mt-0.5"
                />
                <span>I understand that my submission may be evaluated by the BIC judging panel.</span>
              </label>

              <label className="flex items-start space-x-3 text-xs text-slate-650 font-light cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentContact}
                  onChange={(e) => setConsentContact(e.target.checked)}
                  className="mt-0.5"
                />
                <span>I consent to BIC contacting me regarding the competition and related activities.</span>
              </label>
            </div>

            {/* Referral Source */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">How did you hear about BIC?</label>
              <select
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-busec-blue transition-all"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Friend/Coursemate">Friend/Coursemate</option>
                <option value="BUSEC">BUSEC</option>
                <option value="School/Department">School/Department</option>
                <option value="Previous BIC participant">Previous BIC participant</option>
                <option value="Other">Other</option>
              </select>

              {referralSource === "Other" && (
                <input
                  type="text"
                  required
                  value={referralOther}
                  onChange={(e) => setReferralOther(e.target.value)}
                  placeholder="Please specify"
                  className="w-full mt-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all"
                />
              )}
            </div>

            {errorMessage && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 space-y-3">
                <p>{errorMessage}</p>
                {showJoinPrompt && (
                  <a
                    href="/join"
                    className="inline-flex items-center justify-center w-full py-3 bg-busec-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-busec-blue transition-all"
                  >
                    Join BUSEC Now
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-busec-yellow text-busec-navy border border-busec-blue font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 hover:bg-busec-navy hover:text-white transition-all shadow-md shadow-busec-yellow/15 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Team Registration</span>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}