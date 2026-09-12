"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { resourcesList, fundingOpportunities, studentBusinesses } from "@/lib/mockData";
import { Search, Download, ExternalLink, BookOpen, Play, Send } from "lucide-react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Startup Guides",
    "BUSEC Materials",
    "Funding",
    "Marketing",
    "Finance",
    "Technology"
  ];

  const filteredResources = resourcesList.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [emailSub, setEmailSub] = useState({ name: "", email: "" });
  const [subbed, setSubbed] = useState(false);
  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.name && emailSub.email) {
      setSubbed(true);
    }
  };

  const recommendedBooks = [
    { title: "The Lean Startup", author: "Eric Ries", desc: "How constant innovation creates radically successful businesses." },
    { title: "Zero to One", author: "Peter Thiel", desc: "Notes on startups, or how to build the future." },
    { title: "Atomic Habits", author: "James Clear", desc: "An easy & proven way to build good habits & break bad ones." },
    { title: "The Personal MBA", author: "Josh Kaufman", desc: "Master the art of business without the debt or corporate lectures." }
  ];

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-10 overflow-hidden bg-slate-55 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-busec-blue/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center z-10 space-y-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-busec-navy tracking-tight leading-none max-w-4xl mx-auto">
            Resources for Builders & Founders
          </h1>
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto font-light leading-relaxed">
            Get instant access to campus-tested templates, business blueprint guides, startup tools, and active venture funding directories.
          </p>
        </div>
      </section>

      {/* Toolkit Search & Filter Section */}
      <section className="pt-10 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <h2 className="font-display font-bold text-xl text-busec-navy">Startup Toolkit</h2>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates & guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-busec-blue transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Category Filters */}
            <div className="space-y-1 lg:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Categories</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-busec-blue text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-busec-blue"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Resource Cards Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-6 rounded-2xl bg-white border border-slate-150 card-shadow hover:border-slate-250 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-busec-blue uppercase tracking-widest bg-busec-blue/5 px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <h3 className="font-display font-semibold text-base text-slate-800 mt-4">{res.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-light">{res.description}</p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">Size: {res.fileSize}</span>
                      {res.downloadUrl && res.downloadUrl !== "#" ? (
                        <a
                          href={res.downloadUrl}
                          download
                          className="flex items-center space-x-1.5 text-xs font-bold text-busec-blue hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-350 cursor-not-allowed">
                          <Download className="w-4 h-4" />
                          <span>Coming soon</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-16 bg-slate-50 border border-slate-150 rounded-2xl">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-500">No resources found matching search queries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Funding Opportunities Board */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Active Opportunities Board</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Find internships, international accelerators, pitch events, and equity-free grants available for student startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-white border border-slate-150 card-shadow hover:border-slate-250 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded">
                      {opp.organization}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {opp.amount}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-800">{opp.title}</h3>
                  <div className="space-y-2.5 mt-4 text-xs text-slate-655 font-light">
                    <div className="flex items-start space-x-1.5">
                      <span className="font-semibold text-slate-400">Eligibility:</span>
                      <span>{opp.eligibility}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-400">Deadline:</span>
                      <span className="font-mono text-slate-500">{opp.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-busec-blue/5 hover:bg-busec-blue hover:text-white border border-busec-blue/10 text-busec-blue font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Learning Center */}
      <section className="pt-10 pb-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Video Learning Center</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Watch session recordings, developer sprints, business model tutorials, and past pitch nights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden aspect-video group bg-slate-100 border border-slate-150 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
                alt="BIC Pitch Night highlight video"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                <button className="p-4 rounded-full bg-busec-yellow text-busec-navy border border-busec-blue shadow-lg hover:scale-105 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-busec-navy" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950/70 to-transparent">
                <span className="text-[10px] font-bold text-busec-yellow uppercase tracking-widest">BIC highlights</span>
                <h3 className="font-display font-bold text-sm text-white mt-1">BIC 6.0 Pitch Grand Finale Highlights</h3>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video group bg-slate-100 border border-slate-150 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800"
                alt="Product design lecture recording"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                <button className="p-4 rounded-full bg-busec-yellow text-busec-navy border border-busec-blue shadow-lg hover:scale-105 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-busec-navy" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950/70 to-transparent">
                <span className="text-[10px] font-bold text-busec-yellow uppercase tracking-widest">Tutorial Sprint</span>
                <h3 className="font-display font-bold text-sm text-white mt-1">GTM & Building in Public with Yanmo Omorogbe</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Books Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Ecosystem Bookshelf</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Crucial literature recommended by our club directors and advisory board for starting business founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedBooks.map((book, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-150 card-shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800">{book.title}</h3>
                  <span className="text-xs text-busec-blue font-semibold mt-0.5 block">By {book.author}</span>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed font-light">{book.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-busec-blue uppercase tracking-wider block">
                    Available in the BUSEC library — ask an exec
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Businesses Showcase */}
      <section className="pt-10 pb-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Student Business Showcase</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Explore startups and service brands launched and operated by current Babcock University student builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-150 card-shadow-hover hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-busec-blue font-display font-black text-sm">
                      {biz.logo}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-800">{biz.name}</h3>
                      <span className="text-[9px] text-slate-400 font-semibold">{biz.industry}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{biz.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Founder: {biz.founder}</span>
                  <div className="flex items-center space-x-2.5 text-busec-blue">
                    {biz.socials.twitter && <a href="#" className="hover:underline">Twitter</a>}
                    {biz.socials.instagram && <a href="#" className="hover:underline">Instagram</a>}
                    {biz.socials.linkedin && <a href="#" className="hover:underline">LinkedIn</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="font-display font-black text-3xl text-busec-navy tracking-tight">Never Miss an Opportunity</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-light">
              Get notified immediately about new grants, tech hackathons, internships, and BUSEC training schedules.
            </p>
          </div>

          {subbed ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold max-w-md mx-auto">
              Thanks for subscribing, {emailSub.name}! You're now on our opportunities newsletter mailing list.
            </div>
          ) : (
            <form onSubmit={handleSub} className="flex flex-col sm:flex-row items-stretch gap-4 max-w-xl mx-auto">
              <input
                type="text"
                required
                placeholder="First Name"
                value={emailSub.name}
                onChange={(e) => setEmailSub({ ...emailSub, name: e.target.value })}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all w-full sm:w-1/3"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={emailSub.email}
                onChange={(e) => setEmailSub({ ...emailSub, email: e.target.value })}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-busec-blue transition-all w-full sm:w-2/3"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-busec-yellow text-busec-navy border border-busec-blue hover:bg-busec-navy hover:text-white transition-all font-bold text-xs flex items-center justify-center space-x-1.5 flex-shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}