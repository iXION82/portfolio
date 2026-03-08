import SpaceBackground from './components/SpaceBackground';
import './App.css';

function App() {
  return (
    <>
      <SpaceBackground />

      {/* Portfolio content overlay */}
      <div className="relative z-10 min-h-screen overflow-y-auto pointer-events-none" id="portfolio-content">

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 pointer-events-auto">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-pixel text-sm text-cyan-400 tracking-wider">
              &lt;PORTFOLIO/&gt;
            </span>
            <div className="flex gap-6">
              <a href="#hero" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">HOME</a>
              <a href="#about" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">ABOUT</a>
              <a href="#projects" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">PROJECTS</a>
              <a href="#contact" className="text-xs font-pixel text-gray-400 hover:text-cyan-400 transition-colors duration-300">CONTACT</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center pointer-events-auto">
          <div className="animate-float">
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

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-4xl w-full p-8 md:p-12">
            <h2 className="font-pixel text-xl text-cyan-400 mb-8 flex items-center gap-3">
              <span className="text-purple-400">01.</span> ABOUT ME
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Profile Picture */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-2 border-cyan-400/30 group">
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src="/avatar.png"
                    alt="Developer Profile"
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20"></div>
                </div>
                <div className="mt-4 font-pixel text-[10px] text-cyan-400/60 tracking-widest uppercase">
                  STATUS: ONLINE
                </div>
              </div>

              {/* Bio Content */}
              <div className="w-full md:w-2/3 space-y-4 font-body text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate developer who loves crafting immersive digital experiences.
                  With expertise in modern web technologies, I transform ideas into pixel-perfect reality.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                  projects, or gazing at the stars — because the best code, like the universe, is always expanding.
                </p>
                <div className="mt-8 pt-4 border-t border-white/5">
                  <h3 className="font-pixel text-sm text-purple-400 mb-4">TECH STACK</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'Three.js', 'Tailwind', 'Next.js', 'PostgreSQL'].map((tech) => (
                      <span
                        key={tech}
                        className="font-pixel text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 pointer-events-auto">
          <h2 className="font-pixel text-xl text-cyan-400 mb-12 text-center">
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
            ].map((project) => (
              <div
                key={project.title}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
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

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24 pointer-events-auto">
          <div className="glass-card max-w-xl w-full p-8 md:p-12 text-center">
            <h2 className="font-pixel text-xl text-cyan-400 mb-6">
              <span className="text-purple-400">03.</span> CONTACT
            </h2>
            <p className="font-body text-gray-300 mb-8 leading-relaxed">
              Have a project in mind or just want to say hello?
              My inbox is always open. Let's build something amazing together.
            </p>
            <a
              href="mailto:hello@example.com"
              className="inline-block font-pixel text-xs px-8 py-4 bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 rounded hover:bg-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300"
            >
              SAY HELLO ✉
            </a>
            <div className="mt-12 flex justify-center gap-6">
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
