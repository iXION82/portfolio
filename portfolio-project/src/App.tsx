import { useState, useEffect, useRef } from 'react';
import SpaceBackground from './components/SpaceBackground';
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

  // Activate scroll-reveal observer
  useScrollReveal();

  return (
    <>
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative glass-card w-full max-w-2xl p-8 border border-cyan-400/30 animate-scale-in">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white font-pixel text-xl"
              >
                ×
              </button>

              <h2 className="font-pixel text-xl text-cyan-400 mb-8 border-b border-white/10 pb-4">
                SYSTEM SETTINGS
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">COLOR THEME</h3>
                  <div className="flex gap-4">
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

                <div>
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">SHIP CHASSIS</h3>
                  <div className="flex gap-4">
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

                <div>
                  <h3 className="font-pixel text-sm text-gray-300 mb-4">WEAPON SYSTEM</h3>
                  <div className="flex gap-4">
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
          <div className="glass-card max-w-4xl w-full p-8 md:p-12 scroll-reveal">
            <h2 className="font-pixel text-xl text-cyan-400 mb-8 flex items-center gap-3 scroll-reveal-left" style={{ transitionDelay: '0.1s' }}>
              <span className="text-purple-400">01.</span> ABOUT ME
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-1/3 flex flex-col items-center scroll-reveal-left" style={{ transitionDelay: '0.2s' }}>
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-2 border-cyan-400/30 group">
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src="/avatar.jpeg"
                    alt="Developer Profile"
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20"></div>
                </div>
                <div className="mt-4 font-pixel text-[10px] text-cyan-400/60 tracking-widest uppercase">
                  STATUS: ONLINE
                </div>
              </div>

              <div className="w-full md:w-2/3 space-y-4 font-body text-gray-300 leading-relaxed scroll-reveal-right" style={{ transitionDelay: '0.3s' }}>
                <p>
                  I'm a passionate developer who loves crafting immersive digital experiences.
                  With expertise in modern web technologies, I transform ideas into pixel-perfect reality.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                  projects, or gazing at the stars — because the best code, like the universe, is always expanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TECH STACK / SKILLS SECTION ═══ */}
        <section id="skills" className="flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="max-w-4xl w-full scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            <h2 className="font-pixel text-xl text-cyan-400 mb-10 text-center scroll-reveal">
              <span className="text-purple-400">01.5</span> TECH STACK
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'React', icon: '⚛', color: 'cyan' },
                { name: 'TypeScript', icon: 'TS', color: 'blue' },
                { name: 'Node.js', icon: '⬢', color: 'green' },
                { name: 'Python', icon: '🐍', color: 'yellow' },
                { name: 'Three.js', icon: '△', color: 'purple' },
                { name: 'Tailwind', icon: '🌊', color: 'cyan' },
                { name: 'Next.js', icon: 'N', color: 'white' },
                { name: 'PostgreSQL', icon: '🐘', color: 'blue' },
              ].map((tech, index) => (
                <div
                  key={tech.name}
                  className="glass-card p-5 text-center group hover:scale-105 transition-all duration-300 scroll-reveal"
                  style={{ transitionDelay: `${0.15 + index * 0.08}s` }}
                >
                  <div className={`text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`text-${tech.color}-400`}>{tech.icon}</span>
                  </div>
                  <span className="font-pixel text-[10px] text-gray-300 tracking-wider group-hover:text-white transition-colors duration-300">
                    {tech.name}
                  </span>
                  <div className={`mt-3 h-[2px] w-0 group-hover:w-full bg-${tech.color}-400/50 transition-all duration-500 mx-auto`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROJECTS SECTION ═══ */}
        <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 pointer-events-auto">
          <h2 className="font-pixel text-xl text-cyan-400 mb-12 text-center scroll-reveal">
            <span className="text-purple-400">02.</span> PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {[
              {
                title: 'NEBULA ENGINE',
                desc: 'A high-performance rendering engine built with WebGL and Three.js for interactive 3D web experiences.',
                tags: ['Three.js', 'WebGL', 'TypeScript'],
                color: 'cyan',
              },
              {
                title: 'STARMAP API',
                desc: 'RESTful API service for astronomical data with real-time celestial object tracking and visualization.',
                tags: ['Node.js', 'Express', 'MongoDB'],
                color: 'purple',
              },
              {
                title: 'COSMOS CHAT',
                desc: 'Real-time messaging platform with end-to-end encryption, themed around interstellar communication.',
                tags: ['React', 'Socket.io', 'Redis'],
                color: 'pink',
              },
              {
                title: 'ORBIT TRACKER',
                desc: 'Dashboard for tracking satellite orbits with predictive trajectory calculations and live feeds.',
                tags: ['Python', 'D3.js', 'FastAPI'],
                color: 'amber',
              },
              {
                title: 'PIXEL FORGE',
                desc: 'Browser-based pixel art editor with layers, animation support, and collaborative editing features.',
                tags: ['Canvas API', 'React', 'WebRTC'],
                color: 'green',
              },
              {
                title: 'WARP DRIVE',
                desc: 'CI/CD pipeline tool with visual workflow builder and automated deployment to multiple cloud providers.',
                tags: ['Go', 'Docker', 'K8s'],
                color: 'red',
              },
            ].map((project, index) => (
              <div
                key={project.title}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer scroll-reveal"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded bg-${project.color}-500/20 border border-${project.color}-400/30 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}>
                  <span className="font-pixel text-xs text-white">⬡</span>
                </div>
                <h3 className="font-pixel text-sm text-white mb-2">{project.title}</h3>
                <p className="font-body text-sm text-gray-400 mb-4 leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-pixel text-[8px] px-2 py-1 text-gray-500 bg-white/5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CONTACT SECTION ═══ */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-xl w-full p-8 md:p-12 text-center scroll-reveal-scale" style={{ transitionDelay: '0.15s' }}>
            <h2 className="font-pixel text-xl text-cyan-400 mb-6 scroll-reveal" style={{ transitionDelay: '0.25s' }}>
              <span className="text-purple-400">03.</span> CONTACT
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
              SAY HELLO ✉
            </a>
            <div className="mt-12 flex justify-center gap-6 scroll-reveal" style={{ transitionDelay: '0.55s' }}>
              {[
                { name: 'GITHUB', url: '#' },
                { name: 'LINKEDIN', url: '#' },
                { name: 'TWITTER', url: '#' },
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

        {/* Footer */}
        <footer className="py-8 text-center border-t border-white/5">
          <p className="font-pixel text-[10px] text-gray-600">
            DESIGNED & BUILT WITH ♥ AND PIXELS
          </p>
        </footer>

      </div>
    </>
  );
}

export default App;
