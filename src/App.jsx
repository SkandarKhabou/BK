import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Palette, 
  Layers, 
  Cpu, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Link as LinkIcon,
  ExternalLink,
  Sun,
  Moon,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { projects } from './data'

// Performance Optimized Image Component with Skeleton Loading
const SmartImage = ({ src, alt, className, loading = "lazy" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`image-container ${className} ${!isLoaded ? 'skeleton' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <img 
        src={src} 
        alt={alt} 
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setError(true);
        }}
        style={{ 
          opacity: isLoaded ? 1 : 0, 
          transition: 'opacity 0.5s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {error && (
        <div className="error-fallback" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)' }}>
          <Palette size={24} opacity={0.3} />
        </div>
      )}
    </div>
  );
};

// Dropdown Component for Contact
const ContactDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className="primary-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Mail size={20} /> Contact Me <ChevronDown size={16} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="dropdown-menu"
          >
            <a href="mailto:badiis.khabou@gmail.com" className="dropdown-item">
              <Mail size={18} /> 
              <span>badiis.khabou@gmail.com</span>
            </a>
            <a href="tel:+14373289908" className="dropdown-item">
              <Phone size={18} /> 
              <span>+1 (437) 328-9908</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  }
}

const SkillPill = React.memo(({ children }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
    className="pill-badge"
  >
    {children}
  </motion.div>
))

const ExperienceCard = React.memo(({ role, company, period, desc, icon: Icon }) => (
  <motion.div variants={itemVariants} className="glass-card">
    <div className="card-header">
      <div className="card-title-group">
        <div className="icon-box">
          <Icon size={24} />
        </div>
        <div>
          <h3>{role}</h3>
          <p className="company-text">{company}</p>
        </div>
      </div>
      <div className="period-badge">
        {period}
      </div>
    </div>
    <ul className="desc-list">
      {desc.map((item, i) => (
        <li key={i}>
          <ArrowRight className="list-icon" size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
))

const ProjectCarousel = ({ onProjectClick }) => {
  const duplicatedProjects = useMemo(() => [...projects, ...projects, ...projects], [])

  return (
    <div className="carousel-container">
      <motion.div 
        className="carousel-track"
        animate={{ 
          x: ["0%", "-33.33%"],
        }}
        transition={{ 
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          }
        }}
      >
        {duplicatedProjects.map((project, index) => (
          <div 
            key={`${project.title}-${index}`} 
            className="project-card"
            onClick={() => onProjectClick(project)}
          >
            <SmartImage 
              src={project.thumbnail} 
              alt={project.title} 
              className="carousel-img"
            />
            <div className="project-card-info">
              <h3>{project.title}</h3>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const ProjectDetail = ({ project, onBack, onNext, onPrev }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [project]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="project-detail"
    >
      {/* Side Navigation Buttons */}
      <button 
        onClick={onPrev} 
        className="nav-side-btn left" 
        aria-label="Previous Project"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={onNext} 
        className="nav-side-btn right" 
        aria-label="Next Project"
      >
        <ChevronRight size={32} />
      </button>

      <div className="container relative">
        <div className="detail-nav-header">
          <button onClick={onBack} className="back-btn" aria-label="Back to Portfolio">
            <ArrowLeft size={20} /> Back to Portfolio
          </button>
          
          <div className="detail-controls">
            <button onClick={onPrev} className="nav-arrow-btn" aria-label="Previous Project">
              <ChevronLeft size={24} />
            </button>
            <button onClick={onNext} className="nav-arrow-btn" aria-label="Next Project">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="project-detail-content">
          <motion.div 
            key={project.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="project-info-header"
          >
            <h1 className="gradient-text">{project.title}</h1>
            <p className="project-desc-large">{project.description}</p>
            <div className="project-actions">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="primary-btn"
              >
                View on ArtStation <ExternalLink size={20} />
              </a>
            </div>
          </motion.div>

          <div className="project-media-gallery">
            {project.media && project.media.map((url, idx) => {
              const isVideo = url.includes('video_clips') || url.includes('embed.html');
              
              return (
                <motion.div 
                  key={`${project.title}-media-${idx}`}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "200px" }}
                  transition={{ delay: 0.05 }}
                  className={`media-item ${isVideo ? 'video-container' : ''}`}
                >
                  {isVideo ? (
                    <iframe 
                      src={url} 
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture" 
                      allowFullScreen
                      className="project-iframe"
                      title={`${project.title} Presentation Video ${idx}`}
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <SmartImage 
                      src={url} 
                      alt={`${project.title} high-res render ${idx}`} 
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const handleNextProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.title === selectedProject.title);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  }, [selectedProject]);

  const handlePrevProject = useCallback(() => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.title === selectedProject.title);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  }, [selectedProject]);

  // Global Performance Logging
  useEffect(() => {
    if (window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`%c Portfolio Load Time: ${loadTime}ms `, 'background: #38bdf8; color: #000; font-weight: bold;');
    }
  }, []);

  return (
    <div className="app-container">
      <div className="bg-glow" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectDetail 
            key="project-detail"
            project={selectedProject} 
            onBack={() => setSelectedProject(null)} 
            onNext={handleNextProject}
            onPrev={handlePrevProject}
          />
        )}
      </AnimatePresence>

      <div style={{ display: selectedProject ? 'none' : 'block' }}>
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="navbar container"
        >
          <div className="logo" onClick={() => setSelectedProject(null)}>
            BK<span>.</span>
          </div>
          
          <div className="nav-controls">
            <div className="status-badge">
              <div className="pulse-dot" />
              Available for Hire
            </div>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </motion.nav>

        <main className="container">
          <section className="hero-section">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hero-content"
            >
              <div className="hero-text">
                <motion.div variants={itemVariants} className="role-badge">
                  <Sparkles size={16} /> 3D Artist & Game Producer
                </motion.div>
                <motion.h1 variants={itemVariants} className="hero-title">
                  Hi, I'm Badis. <br />
                  I create <span className="gradient-text">digital realities.</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="hero-desc">
                  Professional 3D Artist and Game Producer with 5+ years of experience delivering high-performance assets for real-time engines.
                </motion.p>
                
                <motion.div variants={itemVariants} className="action-group">
                  <ContactDropdown />
                  <a href="https://www.linkedin.com/in/badis-khabou" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn">
                    <LinkIcon size={22} />
                  </a>
                  <a href="https://www.artstation.com/badiskhabou" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="ArtStation">
                    <Globe size={22} />
                  </a>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="hero-image-container">
                <div className="hero-image-wrapper">
                  <div className="hero-image-bg" />
                  <img 
                    src="/photo.jpg" 
                    alt="Badis Khabou Professional Photo" 
                    className="hero-image"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none'; // Hide if missing
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </section>

          <section id="work">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              <h2 className="section-title">
                <Layers className="accent-blue-text" size={32} />
                Selected Works
              </h2>
              <ProjectCarousel onProjectClick={setSelectedProject} />
            </motion.div>
          </section>

          <section id="deployed-apps">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              <h2 className="section-title">
                <Globe className="accent-emerald-text" size={32} />
                TOP 4 deployed apps
              </h2>
              <div className="grid-2">
                {[
                  {
                    title: "Anime Clicker : IO",
                    image: "/animeclicker.png",
                    link: "https://play.google.com/store/apps/details?id=com.stolenpad.animeclicker&hl=en_US",
                    downloads: "5K+"
                  },
                  {
                    title: "Sponge Rush : 3D",
                    image: "/spongerush3d.png",
                    link: "https://play.google.com/store/apps/details?id=com.stolenpad.spongerush3d&hl=en_US",
                    downloads: "1K+"
                  },
                  {
                    title: "Sponge Rush",
                    image: "/spongerush.png",
                    link: "https://play.google.com/store/apps/details?id=com.stolenpad.spongerush&hl=en_US",
                    downloads: "1K+"
                  },
                  {
                    title: "Bomber Golfer",
                    image: "/bombergolfer.png",
                    link: "https://play.google.com/store/apps/details?id=com.stolenpad.bombergolfer&hl=en_US",
                    downloads: "1K+"
                  }
                ].map((app, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants} 
                    className="glass-card" 
                    style={{ padding: '0', overflow: 'hidden', position: 'relative' }}
                    initial="initial"
                    whileHover="hover"
                  >
                    <a href={app.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                      <div style={{ height: '250px', width: '100%' }}>
                        <SmartImage 
                          src={app.image} 
                          alt={app.title} 
                          style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <motion.div 
                        variants={{
                          initial: { opacity: 0, y: 10 },
                          hover: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                        style={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          right: 0, 
                          padding: '2rem 1.5rem 1.5rem', 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          color: '#fff'
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{app.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>{app.downloads}</span>
                          <ExternalLink size={20} color="#38bdf8" />
                        </div>
                      </motion.div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="expertise">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <h2 className="section-title">
                <Palette className="accent-blue-text" size={32} />
                Core Expertise
              </h2>
              <div className="grid-3">
                {[
                  {
                    title: "3D & Sculpting",
                    icon: Layers,
                    colorClass: "accent-blue-text",
                    skills: ["Maya", "ZBrush", "Marvelous Designer", "Arnold"]
                  },
                  {
                    title: "Texturing & UVs",
                    icon: Palette,
                    colorClass: "accent-purple-text",
                    skills: ["Substance Painter", "PBR Workflow", "Photoshop", "UV Mapping"]
                  },
                  {
                    title: "Game Engines",
                    icon: Cpu,
                    colorClass: "accent-emerald-text",
                    skills: ["Unity", "Optimization", "Material Setup", "Profiling"]
                  }
                ].map((category, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="glass-card skill-card">
                    <div className={`icon-box-large ${category.colorClass}`}>
                      <category.icon size={28} />
                    </div>
                    <h3>{category.title}</h3>
                    <div className="skills-wrapper">
                      {category.skills.map(skill => (
                        <SkillPill key={skill}>{skill}</SkillPill>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="experience">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <h2 className="section-title">
                <Briefcase className="accent-purple-text" size={32} />
                Experience
              </h2>
              <div className="list-container">
                <ExperienceCard 
                  icon={Briefcase}
                  role="Game Producer"
                  company="Polysmart SA — Tunis"
                  period="Nov 2024 – Apr 2026"
                  desc={[
                    "Supervised the full game development lifecycle for mobile titles like Wool IO 3D, Dart Heroes, and Herolizer Saga.",
                    "Coordinated interdisciplinary teams and production milestones via Trello and GitHub.",
                    "Ensured alignment between art direction, technical constraints, and production goals."
                  ]}
                />
                <ExperienceCard 
                  icon={Palette}
                  role="3D Artist"
                  company="Polysmart SA — Tunis"
                  period="Jul 2021 – Feb 2024"
                  desc={[
                    "Created game-ready organic and hard-surface 3D assets including props, environments, and characters.",
                    "Translated concept art and orthographic views into fully realized models.",
                    "Performed retopology and optimization for real-time performance."
                  ]}
                />
                <ExperienceCard 
                  icon={Layers}
                  role="3D Artist"
                  company="The Full Room — Tunis"
                  period="Mar 2021 – Jul 2021"
                  desc={[
                    "Modeled photorealistic furniture and environment props for visualization projects.",
                    "Focused on strong shape language and realistic proportions."
                  ]}
                />
                <ExperienceCard 
                  icon={Cpu}
                  role="3D Artist"
                  company="Galactech Studio — Tunis"
                  period="Oct 2020 – Mar 2021"
                  desc={[
                    "Designed and produced characters, props, and environments for mobile games.",
                    "Optimized assets for mobile and real-time performance requirements."
                  ]}
                />
              </div>
            </motion.div>
          </section>

          <section id="education">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid-2"
            >
              <motion.div variants={itemVariants} className="glass-card">
                <div className="card-title-group mb-large">
                  <div className="icon-box accent-blue-text">
                    <GraduationCap size={24} />
                  </div>
                  <h2>Education</h2>
                </div>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot dot-blue"></div>
                    <h4>Master’s Degree – Video Game Development</h4>
                    <p>Université du Québec à Chicoutimi, 2020</p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot dot-gray"></div>
                    <h4>Bachelor’s Degree – Management Computer Science</h4>
                    <p>Faculty of Economic and Management Sciences, 2018</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card">
                <div className="card-title-group mb-large">
                  <div className="icon-box accent-purple-text">
                    <Globe size={24} />
                  </div>
                  <h2>Languages</h2>
                </div>
                <div className="language-list">
                  <div className="language-item">
                    <span className="lang-name">Arabic</span>
                    <span className="lang-level">Native</span>
                  </div>
                  <div className="language-item">
                    <span className="lang-name">French</span>
                    <span className="lang-level">C1</span>
                  </div>
                  <div className="language-item">
                    <span className="lang-name">English</span>
                    <span className="lang-level">B2</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </section>

          <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="footer"
          >
            <p>© {new Date().getFullYear()} Badis Khabou. All rights reserved.</p>
          </motion.footer>
        </main>
      </div>
    </div>
  )
}
