import { useState, useEffect, useRef, useCallback } from 'react';
import SpaceBackground from './components/SpaceBackground';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

export type ThemeType = 'neon' | 'dark' | 'synthwave';
export type ShipModelType = 'fighter' | 'saucer' | 'blocky';
export type WeaponType = 'default' | 'shotgun' | 'sniper';

/* ── Intersection Observer hook for scroll-reveal ── */
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

  // Activate scroll-reveal observer
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
                ⚙ SETTINGS
              </button>
            </div>
          </div>
        </nav>

        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto cursor-auto">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative glass-card w-full max-w-2xl p-8 md:p-10 border border-cyan-400/40 animate-scale-in shadow-[0_0_40px_rgba(34,211,238,0.25)]">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white font-pixel text-xl"
              >
                ×
              </button>

              <div className="flex items-center justify-between mb-6 gap-4 border-b border-white/10 pb-4">
                  <h2 className="font-pixel text-xl text-cyan-400">
                    COCKPIT SETTINGS
                  </h2>
              </div>

              <div className="space-y-8">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">COLOR THEME</h3>
                  <div className="flex flex-wrap gap-3">
                    {(['neon', 'dark', 'synthwave'] as ThemeType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`font-pixel text-[10px] px-4 py-3 rounded uppercase transition-all duration-300 ${theme === t
                          ? 'bg-cyan-500/30 border border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">SHIP CHASSIS</h3>
                  <div className="flex flex-wrap gap-3">
                    {(['fighter', 'saucer', 'blocky'] as ShipModelType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setShipModel(s)}
                        className={`font-pixel text-[10px] px-4 py-3 rounded uppercase transition-all duration-300 ${shipModel === s
                          ? 'bg-purple-500/30 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">WEAPON SYSTEM</h3>
                  <div className="flex flex-wrap gap-3">
                    {(['default', 'shotgun', 'sniper'] as WeaponType[]).map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeaponType(w)}
                        className={`font-pixel text-[10px] px-4 py-3 rounded uppercase transition-all duration-300 ${weaponType === w
                          ? 'bg-green-500/30 border border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                          }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="pointer-events-auto font-pixel text-[10px] px-4 py-2 rounded border border-white/10 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    CLOSE COCKPIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ HERO SECTION ═══ */}
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
            </div>
          </div>
          <div className="mt-16 animate-bounce">
            <span className="font-pixel text-xs text-gray-500">↓ SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        {/* ═══ ABOUT SECTION ═══ */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-4xl w-full p-8 md:p-12 scroll-reveal relative overflow-hidden">
            {/* Glowing accent border on top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

            {/* Section header */}
            <div className="flex items-center gap-4 mb-10 scroll-reveal-left" style={{ transitionDelay: '0.1s' }}>
              <h2 className="font-pixel text-xl text-cyan-400">ABOUT ME</h2>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar column */}
              <div className="w-full md:w-1/3 flex flex-col items-center scroll-reveal-left" style={{ transitionDelay: '0.2s' }}>
                <div className="relative">
                  {/* Pulsing ring behind avatar */}
                  <div className="absolute -inset-3 rounded-2xl border border-cyan-400/20 animate-pulse" />
                  <div className="absolute -inset-6 rounded-2xl border border-purple-400/10" />

                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-2 border-cyan-400/30 group">
                    <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src="/avatar.jpeg"
                      alt="Developer Profile"
                      className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Corner brackets */}
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

              {/* Bio column */}
              <div className="w-full md:w-2/3 scroll-reveal-right" style={{ transitionDelay: '0.3s' }}>
                <div className="relative pl-5 border-l-2 border-purple-400/20 space-y-5">
                  <p className="font-body text-gray-300 leading-relaxed">
                    I'm a passionate developer who loves crafting immersive digital experiences.
                    With expertise in modern web technologies, I transform ideas into <span className="text-cyan-400">pixel-perfect reality</span>.
                  </p>
                  <p className="font-body text-gray-300 leading-relaxed">
                    When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                    projects, or gazing at the stars — because the best code, like the universe, is <span className="text-purple-400">always expanding</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TECH STACK / SKILLS SECTION ═══ */}
        <section id="skills" className="flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="max-w-5xl w-full scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
              <h2 className="font-pixel text-xl text-cyan-400">
                TECH STACK
              </h2>
            </div>

            <div className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { name: 'React', icon: '⚛', color: 'cyan', level: 'Frontend' },
                  { name: 'TypeScript', icon: 'TS', color: 'blue', level: 'Typed JS' },
                  { name: 'Next.js', icon: 'N', color: 'slate', level: 'Fullstack' },
                  { name: 'Tailwind', icon: '🌊', color: 'cyan', level: 'Styling' },
                  { name: 'Node.js', icon: '⬢', color: 'green', level: 'Backend' },
                  { name: 'Express', icon: '⇄', color: 'emerald', level: 'APIs' },
                  { name: 'PostgreSQL', icon: '🐘', color: 'indigo', level: 'Database' },
                  { name: 'MongoDB', icon: '🍃', color: 'green', level: 'NoSQL' },
                  { name: 'Three.js', icon: '△', color: 'purple', level: '3D / WebGL' },
                  { name: 'Python', icon: '🐍', color: 'yellow', level: 'Scripting' },
                  { name: 'Docker', icon: '🐳', color: 'sky', level: 'DevOps' },
                  { name: 'Git / GitHub', icon: '</>', color: 'orange', level: 'Versioning' },
                ].map((tech, index) => (
                  <div
                    key={tech.name}
                    className="relative overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] px-4 py-4 group scroll-reveal"
                    style={{ transitionDelay: `${0.15 + index * 0.06}s` }}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-${tech.color}-500/10 via-transparent to-${tech.color}-400/10`} />
                    <div className="relative flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className={`text-lg md:text-xl`}>
                          <span className={`text-${tech.color}-400`}>{tech.icon}</span>
                        </div>
                        <span className="font-pixel text-[9px] text-gray-500 uppercase tracking-wider">
                          {tech.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-[10px] text-gray-200 tracking-wider">
                          {tech.name}
                        </span>
                        <span className={`h-[2px] w-6 rounded-full bg-${tech.color}-400/70 group-hover:w-10 transition-all duration-300`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ PROJECTS SECTION ═══ */}
        <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 pointer-events-auto">
          <h2 className="font-pixel text-xl text-cyan-400 mb-12 text-center scroll-reveal">
             PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {[
              {
                title: 'NEBULA ENGINE',
                desc: 'A high-performance rendering engine built with WebGL and Three.js for interactive 3D web experiences.',
                tags: ['Three.js', 'WebGL', 'TypeScript'],
                color: 'cyan',
                github: '#',
                demo: '#',
              },
              {
                title: 'STARMAP API',
                desc: 'RESTful API service for astronomical data with real-time celestial object tracking and visualization.',
                tags: ['Node.js', 'Express', 'MongoDB'],
                color: 'purple',
                github: '#',
                demo: '#',
              },
              {
                title: 'COSMOS CHAT',
                desc: 'Real-time messaging platform with end-to-end encryption, themed around interstellar communication.',
                tags: ['React', 'Socket.io', 'Redis'],
                color: 'pink',
                github: '#',
              },
              {
                title: 'ORBIT TRACKER',
                desc: 'Dashboard for tracking satellite orbits with predictive trajectory calculations and live feeds.',
                tags: ['Python', 'D3.js', 'FastAPI'],
                color: 'amber',
                github: '#',
              },
              {
                title: 'PIXEL FORGE',
                desc: 'Browser-based pixel art editor with layers, animation support, and collaborative editing features.',
                tags: ['Canvas API', 'React', 'WebRTC'],
                color: 'green',
                github: '#',
                demo: '#',
              },
              {
                title: 'WARP DRIVE',
                desc: 'CI/CD pipeline tool with visual workflow builder and automated deployment to multiple cloud providers.',
                tags: ['Go', 'Docker', 'K8s'],
                color: 'red',
                github: '#',
              },
            ].map((project, index) => (
              <div
                key={project.title}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer scroll-reveal"
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

        {/* ═══ CONTACT SECTION ═══ */}
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
              href="mailto:hello@example.com"
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
