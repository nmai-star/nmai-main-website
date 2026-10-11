"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ExternalLink, Globe, Sparkles } from "lucide-react";

export default function FounderSection() {
  return (
<motion.section id="founder" aria-label="Meet the founder"
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-14"
          >

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080D17] p-6 md:p-8 lg:p-10">

              <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative grid items-center gap-10 lg:grid-cols-[320px_1fr]">

                {/* PHOTO */}

                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    className="relative mx-auto w-full max-w-[320px]"
                  >

                    <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-blue-500/30 to-cyan-400/20 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05070D]">

                      <Image width={320} height={390} sizes="(max-width: 640px) 85vw, 320px"
                        src="/kranthi.png"
                        alt="Kranthi Velpuri - Founder and CEO of NMAI"
                        className="h-[390px] w-full object-cover object-top"
                      />

                    </div>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/20 bg-[#070B14]/95 px-5 py-2.5 text-[10px] font-bold tracking-[0.16em] text-cyan-300 shadow-2xl backdrop-blur-xl">
                      FOUNDER • NMAI
                    </div>

                  </motion.div>

                  <a
                    href="http://kranthivelpuri.lovable.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white"
                  >
                    <Globe size={14} className="text-cyan-400" />
                    <span>kranthivelpuri.lovable.app</span>
                    <ExternalLink size={13} className="text-slate-400" />
                  </a>
                </div>

                {/* CONTENT */}

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-500/[0.06] px-3 py-1.5 text-xs font-semibold text-blue-300">
                    <Sparkles size={13} />
                    Meet the Founder
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Kranthi Velpuri
                  </h2>

                  <p className="mt-2 text-lg font-medium text-cyan-300">
                    Founder & CEO — NMAI
                  </p>

                  <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                    NMAI was created with a simple mission — to help people
                    learn practical digital skills and use AI to build
                    better opportunities in the modern world.
                  </p>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                    From AI and automation to digital business, content
                    creation, marketing and network marketing, NMAI focuses
                    on practical learning that can be implemented in the
                    real world.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">

                    {[
                      {
                        title: "Learn",
                        text: "Learn skills that matter in the real world.",
                      },
                      {
                        title: "Implement",
                        text: "Turn knowledge into practical action.",
                      },
                      {
                        title: "Build",
                        text: "Build skills, systems and digital opportunities.",
                      },
                      {
                        title: "Evolve",
                        text: "Keep learning as technology continues to evolve.",
                      },
                    ].map((item) => (

                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                      >

                        <div className="flex items-center gap-2">

                          <CheckCircle2
                            size={17}
                            className="text-cyan-300"
                          />

                          <p className="font-semibold text-white">
                            {item.title}
                          </p>

                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {item.text}
                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

                    <p className="text-sm italic leading-7 text-slate-200 md:text-base">
                      “The future belongs to people who know how to use AI —
                      not people who are afraid of it.”
                    </p>

                  </div>

                  {/* KNOW MORE ABOUT THE FOUNDER BUTTON */}
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a
                      href="http://kranthivelpuri.lovable.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-cyan-500/40"
                    >
                      <Globe size={16} className="text-white transition-transform duration-300 group-hover:rotate-12" />
                      Know More About the Founder
                      <ExternalLink size={14} className="opacity-85 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </motion.section>
  );
}
