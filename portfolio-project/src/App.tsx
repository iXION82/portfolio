import { useState, useEffect, useRef, useCallback } from 'react';
import SpaceBackground from './components/SpaceBackground';
import LoadingScreen from './components/LoadingScreen';
import { SiCplusplus, SiTypescript, SiPython, SiReact, SiNextdotjs, SiNodedotjs, SiSocketdotio, SiMongodb, SiPostgresql, SiTailwindcss, SiScikitlearn, SiDocker } from 'react-icons/si';
import './App.css';

export type ThemeType = 'neon' | 'dark' | 'synthwave';
export type ShipModelType = 'fighter' | 'saucer' | 'blocky';
export type WeaponType = 'default' | 'shotgun' | 'sniper';

function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
    );
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);
}

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('neon');
  const [shipModel, setShipModel] = useState<ShipModelType>('fighter');
  const [weaponType, setWeaponType] = useState<WeaponType>('default');
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  useScrollReveal();

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <SpaceBackground theme={theme} shipModel={shipModel} weaponType={weaponType} />

      <div className="relative z-10 min-h-screen overflow-y-auto pointer-events-none" id="portfolio-content">

        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 pointer-events-auto">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-pixel text-sm text-cyan-400 tracking-wider">
              &lt;PORTFOLIO/&gt;
            </span>
            <div className="flex gap-6">
              <a href="#hero" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">HOME</a>
              <a href="#about" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">ABOUT</a>
              <a href="#skills" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">SKILLS</a>
              <a href="#projects" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">PROJECTS</a>
              <a href="#contact" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">CONTACT</a>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs font-pixel text-purple-400 hover:text-cyan-400 transition-colors duration-300 ml-4 flex items-center gap-2"
              >
                SETTINGS
              </button>
            </div>
          </div>
        </nav>

        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto cursor-auto px-4">
            {/* Darker backdrop with blur */}
            <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsSettingsOpen(false)}></div>
            
            {/* Graceful Modal Container */}
            <div className="relative w-full max-w-2xl p-8 md:p-12 animate-scale-in">
              {/* Gradient border effect using pseudo-elements / wrapping div */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/20 via-purple-500/10 to-transparent p-[1px]">
                <div className="absolute inset-0 rounded-2xl bg-[#0a0a14]/95 backdrop-blur-2xl h-full w-full"></div>
              </div>

              {/* Content wrapper */}
              <div className="relative z-10">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-pixel text-xl transition-all duration-300 hover:rotate-90 hover:scale-110 shadow-lg"
                >
                  ×
                </button>

                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mb-6"></div>
                  <h2 className="font-pixel text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 tracking-wider">
                    SYSTEM PREFERENCES
                  </h2>
                  <p className="font-body text-sm text-gray-400 mt-3">Customize your interactive universe</p>
                </div>

                <div className="space-y-8">
                  {/* Theme Section */}
                  <div className="relative group">
                    <h3 className="font-pixel text-[10px] text-cyan-400/80 mb-4 tracking-[0.2em] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-400/50"></span> COLOR PROTOCOL
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(['neon', 'dark', 'synthwave'] as ThemeType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`relative overflow-hidden font-pixel text-[9px] px-6 py-3 rounded-lg uppercase tracking-widest transition-all duration-500 ${theme === t
                            ? 'text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                            : 'text-gray-500 hover:text-gray-300 bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}
                        >
                          {theme === t && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-lg"></div>
                          )}
                          <span className="relative z-10">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ship Chassis Section */}
                  <div className="relative group">
                    <h3 className="font-pixel text-[10px] text-purple-400/80 mb-4 tracking-[0.2em] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-purple-400/50"></span> VESSEL CHASSIS
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(['fighter', 'saucer', 'blocky'] as ShipModelType[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setShipModel(s)}
                          className={`relative overflow-hidden font-pixel text-[9px] px-6 py-3 rounded-lg uppercase tracking-widest transition-all duration-500 ${shipModel === s
                            ? 'text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                            : 'text-gray-500 hover:text-gray-300 bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}
                        >
                          {shipModel === s && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg"></div>
                          )}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weapon System Section */}
                  <div className="relative group">
                    <h3 className="font-pixel text-[10px] text-green-400/80 mb-4 tracking-[0.2em] flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-400/50"></span> WEAPON SYSTEM
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(['default', 'shotgun', 'sniper'] as WeaponType[]).map((w) => (
                        <button
                          key={w}
                          onClick={() => setWeaponType(w)}
                          className={`relative overflow-hidden font-pixel text-[9px] px-6 py-3 rounded-lg uppercase tracking-widest transition-all duration-500 ${weaponType === w
                            ? 'text-green-100 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                            : 'text-gray-500 hover:text-gray-300 bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}
                        >
                          {weaponType === w && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-lg"></div>
                          )}
                          <span className="relative z-10">{w}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center pointer-events-auto">
          <div className="animate-float scroll-reveal-scale">
            <p className="font-pixel text-xs text-purple-400 tracking-[0.3em] mb-4 uppercase">Welcome to my universe</p>
            <h1 className="font-pixel text-3xl md:text-5xl text-white mb-6 leading-tight">
              <span className="text-cyan-400">SPACE</span> DEVELOPER
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Full-stack developer navigating the digital cosmos.
              Building beautiful, functional experiences — one pixel at a time.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#projects"
                className="font-pixel text-xs px-6 py-3 bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 rounded hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
              >
                VIEW PROJECTS
              </a>
              <a
                href="#contact"
                className="font-pixel text-xs px-6 py-3 bg-purple-500/20 border border-purple-400/40 text-purple-400 rounded hover:bg-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
              >
                CONTACT ME
              </a>
              <a
                href="/Resume (2).pdf"
                download="Ayushman_Singh_Chauhan_Resume.pdf"
                className="font-pixel text-xs px-6 py-3 bg-green-500/20 border border-green-400/40 text-green-400 rounded hover:bg-green-500/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300"
              >
                DOWNLOAD RESUME
              </a>
            </div>
          </div>
          <div className="mt-16 animate-bounce">
            <span className="font-pixel text-xs text-gray-500">↓ SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-4xl w-full p-8 md:p-12 scroll-reveal relative overflow-hidden">

            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

            <div className="flex items-center gap-4 mb-10 scroll-reveal-left" style={{ transitionDelay: '0.1s' }}>
              <h2 className="font-pixel text-xl text-cyan-400">ABOUT ME</h2>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">

              <div className="w-full md:w-1/3 flex flex-col items-center scroll-reveal-left" style={{ transitionDelay: '0.2s' }}>
                <div className="relative">

                  <div className="absolute -inset-3 rounded-2xl border border-cyan-400/20 animate-pulse" />
                  <div className="absolute -inset-6 rounded-2xl border border-purple-400/10" />

                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-2 border-cyan-400/30 group">
                    <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src="/avatar.jpeg"
                      alt="Developer Profile"
                      className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20"></div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                  <span className="font-pixel text-[10px] text-green-400/80 tracking-widest uppercase">
                    OPEN TO WORK
                  </span>
                </div>
              </div>

              <div className="w-full md:w-2/3 scroll-reveal-right" style={{ transitionDelay: '0.3s' }}>
                <div className="relative pl-5 border-l-2 border-purple-400/20 space-y-5">
                  <p className="font-body text-gray-300 leading-relaxed">
                    Hi, I am <span className="text-cyan-400 font-bold tracking-wide">Ayushman Singh Chauhan</span>, a 3rd year student at <span className="text-white">IIT (ISM) Dhanbad</span>.
                    I'm a passionate developer who loves crafting immersive digital experiences.
                    Using modern web technologies, I enjoy transforming ideas into
                    <span className="text-cyan-400"> pixel-perfect reality</span> while building fast and interactive applications.
                  </p>

                  <p className="font-body text-gray-300 leading-relaxed">
                    When I'm not coding, I enjoy experimenting with new frameworks and practicing
                    <span className="text-purple-400"> competitive programming</span>, solving challenging algorithmic problems that sharpen my problem-solving skills and push me to think more efficiently about code and algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="max-w-5xl w-full scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            {/* Section header matching About Me style */}
            <div className="flex items-center gap-4 mb-10 scroll-reveal-left" style={{ transitionDelay: '0.1s' }}>
              <h2 className="font-pixel text-xl text-cyan-400">TECH STACK</h2>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {[
                { name: 'C / C++', icon: <SiCplusplus />, hex: '#60a5fa', level: 'Systems & CP' },
                { name: 'TypeScript', icon: <SiTypescript />, hex: '#3b82f6', level: 'Language' },
                { name: 'Python', icon: <SiPython />, hex: '#facc15', level: 'Data & Scripting' },
                { name: 'React.js', icon: <SiReact />, hex: '#22d3ee', level: 'Frontend UI' },
                { name: 'Next.js', icon: <SiNextdotjs />, hex: '#94a3b8', level: 'Fullstack' },
                { name: 'Node & Express', icon: <SiNodedotjs />, hex: '#4ade80', level: 'Backend API' },
                { name: 'Socket.IO', icon: <SiSocketdotio />, hex: '#818cf8', level: 'Real-time' },
                { name: 'MongoDB', icon: <SiMongodb />, hex: '#22c55e', level: 'NoSQL DB' },
                { name: 'SQL Databases', icon: <SiPostgresql />, hex: '#fb923c', level: 'Relational DB' },
                { name: 'Tailwind CSS', icon: <SiTailwindcss />, hex: '#22d3ee', level: 'Styling' },
                { name: 'Machine Learning', icon: <SiScikitlearn />, hex: '#c084fc', level: 'Scikit / Pandas' },
                { name: 'Docker & Git', icon: <SiDocker />, hex: '#38bdf8', level: 'DevOps & Tools' },
              ].map((tech, index) => (
                <div
                  key={tech.name}
                  className="relative overflow-hidden rounded-xl bg-white/[0.02] backdrop-blur-sm group scroll-reveal cursor-default"
                  style={{
                    transitionDelay: `${0.15 + index * 0.06}s`,
                    border: `1px solid ${tech.hex}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${tech.hex}40`;
                    e.currentTarget.style.boxShadow = `0 0 25px ${tech.hex}15, inset 0 0 30px ${tech.hex}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${tech.hex}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Colored top accent bar */}
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${tech.hex}60, transparent)` }} />

                  <div className="px-4 py-5 flex flex-col items-center text-center gap-3">
                    {/* Icon with glow circle */}
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ background: tech.hex }}
                      />
                      <div
                        className="relative flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${tech.hex}12`, border: `1px solid ${tech.hex}25` }}
                      >
                        <span className="text-xl" style={{ color: tech.hex }}>{tech.icon}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <span className="font-pixel text-[10px] text-gray-200 tracking-wider">{tech.name}</span>

                    {/* Level badge */}
                    <span
                      className="font-pixel text-[7px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                      style={{ color: `${tech.hex}cc`, background: `${tech.hex}10`, border: `1px solid ${tech.hex}20` }}
                    >
                      {tech.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 pointer-events-auto">
          <h2 className="font-pixel text-xl text-cyan-400 mb-12 text-center scroll-reveal">
            PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {[
              {
                title: 'BYTESYNC',
                desc: 'A full-stack collaborative code editor — write, run, and debug code together in real-time with live cursor tracking, integrated chat, and automatic session replay.',
                tags: ['React', 'WebSocket', 'Node.js', 'Monaco'],
                color: 'purple',
                github: 'https://github.com/iXION82/ByteSync',
                demo: 'https://byte-sync-chi.vercel.app/',
              },
              {
                title: 'TYPERUSH',
                desc: 'A sleek, full-stack typing speed test app with lifetime stats tracking, interactive achievements, global leaderboards, and a customizable space-themed UI.',
                tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
                color: 'cyan',
                github: 'https://github.com/iXION82/TypeRush',
                demo: 'https://type-rush-five.vercel.app/home',
              },
              {
                title: 'ROAD SOS',
                desc: 'A real-time emergency road safety platform with GPS tracking, SMS alerts, interactive maps, traffic reporting, and offline-first architecture.',
                tags: ['Android', 'GPS', 'Maps API', 'Node.js'],
                color: 'amber',
                github: 'https://github.com/iXION82/RoadSOS_Final',
                demo: 'https://road-sos-lastest.vercel.app/',
              },
              {
                title: 'TRIVALENT JOB BOARD',
                desc: 'A comprehensive full-stack recruitment platform with AI-powered job recommendations, intelligent resume parsing, and a seamless application process.',
                tags: ['React', 'AI/ML', 'Node.js', 'MongoDB'],
                color: 'pink',
                github: 'https://github.com/iXION82/Contest',
              },
              {
                title: 'ASCE IIT(ISM)',
                desc: 'A high-performance, interactive web application built for the ASCE Student Chapter at IIT (ISM) Dhanbad with stunning visuals and smooth animations.',
                tags: ['React', 'Three.js', 'Tailwind', 'Vite'],
                color: 'green',
                github: 'https://github.com/iXION82/CivilSociety',
              },
              {
                title: 'SUYASH CAMPAIGN',
                desc: 'An immersive political campaign portfolio featuring interactive 3D visuals, scroll-driven animations, glassmorphism design, and full-stack MongoDB integration.',
                tags: ['React', 'Three.js', 'MongoDB', 'GSAP'],
                color: 'red',
                github: 'https://github.com/iXION82/Suyash_Profile',
                demo: 'https://suyash-profile.vercel.app',
              },
              {
                title: 'SPACE PORTFOLIO',
                desc: 'A modern space-themed portfolio with an immersive 3D background, scroll-driven animations, glassmorphism design, and interactive mini-games.',
                tags: ['React', 'Three.js', 'Tailwind', 'Vite'],
                color: 'cyan',
                github: 'https://github.com/iXION82/portfolio',
              },
            ].map((project, index) => (
              <div
                key={project.title}
                className={`glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer scroll-reveal ${index === 6 ? 'lg:col-start-2' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >

                <h3 className="font-pixel text-sm text-white mb-2">{project.title}</h3>
                <p className="font-body text-sm text-gray-400 mb-4 leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-pixel text-[8px] px-2 py-1 text-gray-500 bg-white/5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={project.github}
                    className="font-pixel text-[9px] px-3 py-1.5 rounded border border-white/10 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    GITHUB
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="font-pixel text-[9px] px-3 py-1.5 rounded border border-purple-400/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-all duration-300"
                    >
                      LIVE DEMO
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-xl w-full p-8 md:p-12 text-center scroll-reveal-scale" style={{ transitionDelay: '0.15s' }}>
            <h2 className="font-pixel text-xl text-cyan-400 mb-6 scroll-reveal" style={{ transitionDelay: '0.25s' }}>
              CONTACT
            </h2>
            <p className="font-body text-gray-300 mb-8 leading-relaxed scroll-reveal" style={{ transitionDelay: '0.35s' }}>
              Have a project in mind or just want to say hello?
              My inbox is always open. Let's build something amazing together.
            </p>
            <a
              href="mailto:895731a1@gmail.com"
              className="inline-block font-pixel text-xs px-8 py-4 bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 rounded hover:bg-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 scroll-reveal"
              style={{ transitionDelay: '0.45s' }}
            >
              SAY HELLO
            </a>
            <div className="mt-12 flex justify-center gap-6 scroll-reveal" style={{ transitionDelay: '0.55s' }}>
              {[
                { name: 'GITHUB', url: 'https://github.com/iXION82' },
                { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/ayushman-singh-chauhan-6a52b8320/' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="font-pixel text-[10px] text-gray-500 hover:text-cyan-400 transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </section>
        <footer className="py-8 text-center border-t border-white/5">
          <p className="font-pixel text-[10px] text-gray-600">
            {/* DESIGNED & BUILT WITH ♥ AND PIXELS */}
          </p>
        </footer>

      </div>
    </>
  );
}

export default App;
