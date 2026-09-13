"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { builderStories } from "@/lib/mockData";
import { ArrowRight, ArrowDown, Calendar, Tag, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BuilderStories() {
  const stories = builderStories;

  const scrollToStory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-10 overflow-hidden bg-slate-55 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-busec-blue/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center z-10 space-y-6">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-busec-navy tracking-tight leading-none max-w-4xl mx-auto">
            Builder Stories & Sprints
          </h1>
          <p className="text-base sm:text-lg text-slate-655 max-w-2xl mx-auto font-light leading-relaxed">
            Long-form editorial profiles on student founders, software builders, and alumni innovators engineering startups at Babcock.
          </p>
        </div>
      </section>

      {/* Editorial Long-Form Section */}
      <section className="pt-10 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-24">
          {stories.length > 0 ? (
            stories.map((story, idx) => {
              const isEven = idx % 2 === 0;
              const nextStory = stories[idx + 1];
              return (
                <div
                  key={story.id}
                  id={story.id}
                  className="border-b border-slate-100 pb-16 last:border-0 last:pb-0 scroll-mt-28 space-y-10"
                >
                  <div className={`flex flex-col lg:flex-row items-center gap-12 ${isEven ? "" : "lg:flex-row-reverse"}`}>
                    {/* Large Editorial Image */}
                    <div className="w-full lg:w-1/2 relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-150 bg-slate-50">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-portrait-founder hover:scale-[1.01] transition-transform duration-500"
                      />
                    </div>

                    {/* Long-Form Text Content */}
                    <div className="w-full lg:w-1/2 space-y-6">
                      <div className="flex items-center space-x-3.5 text-xs text-slate-500 uppercase tracking-widest font-bold">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-3.5 h-3.5 text-busec-blue" />
                          <span>{story.category}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{story.date}</span>
                        </span>
                      </div>

                      <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-800 tracking-tight leading-tight">
                        {story.title}
                      </h2>

                      <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-display font-bold text-slate-700 text-xs">
                          {story.founder[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{story.founder}</span>
                          <span className="text-[10px] text-slate-455 uppercase tracking-wider font-semibold">Founder, {story.company}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light whitespace-pre-wrap">
                        {story.content}
                      </p>

                      <div className="pt-2">
                        <Link
                          href="/join"
                          className="inline-flex items-center space-x-2 text-xs font-bold text-busec-blue hover:underline"
                        >
                          <span>Join BUSEC to connect with {story.founder}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Next Story Navigation */}
                  {nextStory && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => scrollToStory(nextStory.id)}
                        className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-busec-navy uppercase tracking-wider hover:bg-busec-blue hover:text-white hover:border-busec-blue transition-all"
                      >
                        <span>Next Story: {nextStory.founder}</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-slate-50 border border-slate-150 rounded-3xl max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-700 text-lg">No builder stories published yet</h3>
              <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                Check back soon for long-form editorial profiles on student founders and software builders. Admin users can post new stories from the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quote callout section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-4xl text-busec-blue/40 block">"</span>
          <blockquote className="font-display font-semibold text-lg sm:text-xl text-slate-700 leading-relaxed">
            A university degree may open doors, but an entrepreneurial mindset gives you the courage to build your own.
          </blockquote>
          <cite className="block text-xs font-bold uppercase tracking-widest text-slate-400 not-italic">
            — Hamed Otun, President, Babcock University Students' Entrepreneurship Club (BUSEC), 2025/2026
          </cite>
        </div>
      </section>

      <Footer />
    </>
  );
}