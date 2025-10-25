
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOnScreen } from './hooks/useOnScreen';
import { MenuIcon, XIcon, CodeIcon, PenToolIcon, BriefcaseIcon, MessageSquareIcon, GithubIcon, LinkedinIcon, TwitterIcon, ArrowUpIcon } from './components/icons';

// Types
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

// Data
const servicesData: Service[] = [
  { icon: <PenToolIcon />, title: "UI/UX デザイン", description: "ユーザー中心設計に基づき、美しさと機能性を両立したインターフェースを構築します。" },
  { icon: <CodeIcon />, title: "ウェブ開発", description: "最新の技術スタックを駆使し、高速かつ堅牢なウェブアプリケーションを開発します。" },
  { icon: <BriefcaseIcon />, title: "ブランドアイデンティティ", description: "企業の核心を捉え、記憶に残る視覚的アイデンティティシステムを創造します。" },
  { icon: <MessageSquareIcon />, title: "テクニカルコンサルティング", description: "最適な技術選定からアーキテクチャ設計まで、プロジェクトを成功に導きます。" },
];

const portfolioData: Project[] = [
  { title: "Project: Genesis", description: "次世代EコマースプラットフォームのUI/UXデザインとフロントエンド開発。", tags: ["Next.js", "TypeScript", "Vercel"], image: "https://picsum.photos/seed/genesis/600/400" },
  { title: "Project: Nova", description: "AIを活用したデータ可視化ダッシュボード。複雑な情報を直感的に伝えます。", tags: ["React", "D3.js", "AWS"], image: "https://picsum.photos/seed/nova/600/400" },
  { title: "Project: Orion", description: "クリエイティブエージェンシーのブランドリニューアルと公式サイト制作。", tags: ["Figma", "Webflow", "CMS"], image: "https://picsum.photos/seed/orion/600/400" },
];

// Helper Components (defined outside main component to prevent re-creation)

const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isOnScreen = useOnScreen(ref);

  useEffect(() => {
    if (isOnScreen) {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isOnScreen, end, duration]);

  return <span ref={ref}>{count}</span>;
};

const Section: React.FC<{ children: React.ReactNode; id: string; className?: string }> = ({ children, id, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isOnScreen = useOnScreen(ref, { threshold: 0.1 });

    return (
        <section
            ref={ref}
            id={id}
            className={`py-20 md:py-32 px-6 md:px-10 max-w-7xl mx-auto transition-opacity duration-1000 ${isOnScreen ? 'opacity-100' : 'opacity-0'} ${className}`}
        >
            {children}
        </section>
    );
};

const SectionTitle: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter relative inline-block">
            {title}
            <span className="absolute -top-4 -left-4 text-8xl md:text-9xl font-body text-dark-gray -z-10 opacity-50 select-none">{subtitle}</span>
        </h2>
    </div>
);

const BinaryRain: React.FC = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-20 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="font-body text-neon-green text-xs absolute top-0 animate-binary-fall"
               style={{
                   left: `${i * 5}%`,
                   animationDelay: `${Math.random() * 10}s`,
                   animationDuration: `${5 + Math.random() * 10}s`
               }}>
                {Array.from({ length: 100 }).map((_, j) => (
                    <span key={j} className={Math.random() > 0.5 ? 'opacity-100' : 'opacity-50'}>{Math.round(Math.random())}<br /></span>
                ))}
            </p>
        ))}
    </div>
);

// Main App Component
const App: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <div className="bg-true-black min-h-screen">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isScrolled={isScrolled} />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
      {isScrolled && (
          <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 bg-dark-gray border border-electric-blue/50 rounded-full shadow-lg shadow-electric-blue/20 hover:bg-electric-blue hover:shadow-glow-blue transition-all duration-300 z-50"
              aria-label="トップに戻る"
          >
              <ArrowUpIcon />
          </button>
      )}
    </div>
  );
};


// Sub-components for App
const Header: React.FC<{ isMenuOpen: boolean; setIsMenuOpen: (isOpen: boolean) => void; isScrolled: boolean; }> = ({ isMenuOpen, setIsMenuOpen, isScrolled }) => {
    const navLinks = ["SERVICES", "PORTFOLIO", "ABOUT", "CONTACT"];

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-true-black/80 backdrop-blur-sm border-b border-dark-gray' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-20">
                    <a href="#hero" className="font-display text-xl font-bold tracking-wider glitch">
                        <span className="glitch-text">仮想回路</span>
                    </a>
                    <nav className="hidden md:flex space-x-8 font-body">
                        {navLinks.map(link => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm uppercase tracking-widest hover:text-electric-blue transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-electric-blue after:transition-all after:duration-300 hover:after:w-full">{link}</a>
                        ))}
                    </nav>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-50" aria-label="メニューを開閉">
                        {isMenuOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </header>
            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-true-black/95 backdrop-blur-lg z-40 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                <nav className="flex flex-col items-center justify-center h-full space-y-12">
                     {navLinks.map(link => (
                        <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="font-display text-3xl uppercase tracking-widest hover:text-electric-blue transition-colors duration-300">{link}</a>
                    ))}
                </nav>
            </div>
        </>
    );
};

const Hero: React.FC = () => {
    return (
        <section id="hero" className="h-screen min-h-[700px] flex flex-col items-center justify-center text-center relative overflow-hidden px-4">
            <div className="absolute inset-0 -z-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path d="M 10,10 C 200,10 150,300 400,300 S 600,100 800,200 S 1000,500 1200,400" stroke="#0066FF" strokeWidth="1" fill="none" strokeDasharray="5 5" className="animate-circuit-flow" />
                    <path d="M 90vw,10vh C 70vw,20vh 80vw,80vh 50vw,70vh S 20vw,90vh 10vw,50vh" stroke="#00FF66" strokeWidth="0.5" fill="none" strokeDasharray="1000" className="animate-circuit-flow" style={{animationDelay: '2s', animationDuration: '8s'}} />
                </svg>
                <BinaryRain />
            </div>

            <div className="z-10">
                <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter glitch">
                    <span className="glitch-text" data-text="仮想回路">仮想回路</span>
                </h1>
                <p className="font-body text-md md:text-xl mt-4 tracking-widest text-off-white/80">
                    Designing the Future, One Circuit at a Time
                </p>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 font-body text-xs uppercase tracking-widest flex flex-col items-center space-y-2">
                <span>Scroll</span>
                <div className="w-px h-8 bg-electric-blue animate-pulse"></div>
            </div>

             <div className="absolute bottom-20 w-full z-10">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center px-4">
                    <div>
                        <p className="font-display text-3xl md:text-5xl font-bold text-neon-green"><AnimatedCounter end={42} /></p>
                        <p className="font-body text-xs uppercase tracking-widest text-off-white/70 mt-1">Projects Delivered</p>
                    </div>
                    <div>
                        <p className="font-display text-3xl md:text-5xl font-bold text-neon-green"><AnimatedCounter end={100} />K+</p>
                        <p className="font-body text-xs uppercase tracking-widest text-off-white/70 mt-1">Lines of Code</p>
                    </div>
                    <div>
                        <p className="font-display text-3xl md:text-5xl font-bold text-neon-green"><AnimatedCounter end={100} />%</p>
                        <p className="font-body text-xs uppercase tracking-widest text-off-white/70 mt-1">Client Satisfaction</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Services: React.FC = () => {
    return (
        <Section id="services">
            <SectionTitle title="CIRCUIT MODULES" subtitle="01" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {servicesData.map((service, index) => (
                    <div key={index} className="bg-dark-gray p-8 border border-dark-gray hover:border-electric-blue/50 group transition-all duration-300 transform hover:-translate-y-1">
                        <div className="text-electric-blue mb-4 group-hover:text-neon-green transition-colors duration-300">{service.icon}</div>
                        <h3 className="font-display text-xl font-bold mb-2">{service.title}</h3>
                        <p className="font-jp text-sm text-off-white/70 leading-relaxed">{service.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const Portfolio: React.FC = () => {
    return (
        <Section id="portfolio">
            <SectionTitle title="PROJECT ARCHIVE" subtitle="02" />
            <div className="space-y-16">
                {portfolioData.map((project, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
                        <div className={`relative overflow-hidden ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                           <img src={project.image} alt={project.title} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                           <div className="absolute inset-0 bg-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                            <h3 className="font-display text-3xl font-bold mb-3">{project.title}</h3>
                            <p className="font-jp text-off-white/80 mb-4 leading-relaxed">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => <span key={tag} className="font-body text-xs bg-dark-gray px-3 py-1 text-neon-green">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const About: React.FC = () => {
    return (
        <Section id="about">
            <SectionTitle title="THE ARCHITECT" subtitle="03" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-dark-gray p-6 font-body text-sm text-neon-green min-h-[300px] border border-dark-gray">
                    <p>&gt; architect.bio</p>
                    <p className="mt-4 text-off-white/90 font-jp leading-relaxed">
                        はじめまして。「仮想回路」の設計者です。<br/>
                        デジタル領域における10年以上の経験を基に、コードとクリエイティビティを融合させ、単なるウェブサイトではなく、記憶に残る体験を創造します。<br/><br/>
                        私の哲学は「目的ある美学」。すべてのピクセル、すべてのアニメーションには意味があり、ビジネス目標達成のための戦略的要素です。<br/><br/>
                        <span className="text-neon-green/80">#Innovation #Craftsmanship #Collaboration</span>
                    </p>
                    <span className="animate-ping">_</span>
                </div>
                <div>
                    <img src="https://picsum.photos/seed/architect/600/600" alt="Architect Portrait" className="w-full h-auto object-cover grayscale brightness-75 contrast-125" />
                </div>
            </div>
        </Section>
    );
};

const Contact: React.FC = () => {
    return (
        <Section id="contact" className="bg-dark-gray">
            <SectionTitle title="INITIATE CONNECTION" subtitle="04" />
            <form className="max-w-2xl mx-auto space-y-6">
                <input type="text" placeholder="お名前 / NAME" className="w-full bg-true-black/50 p-4 font-body border-2 border-dark-gray focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all duration-300" />
                <input type="email" placeholder="メールアドレス / EMAIL" className="w-full bg-true-black/50 p-4 font-body border-2 border-dark-gray focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all duration-300" />
                <textarea placeholder="メッセージ / MESSAGE" rows={5} className="w-full bg-true-black/50 p-4 font-body border-2 border-dark-gray focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all duration-300"></textarea>
                <button type="submit" className="w-full bg-electric-blue p-4 font-display text-lg font-bold tracking-wider hover:bg-neon-green hover:text-true-black transition-all duration-300 relative group overflow-hidden">
                    <span className="relative z-10">回路を繋げる / ESTABLISH CIRCUIT</span>
                    <span className="absolute inset-0 bg-off-white/20 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                </button>
            </form>
        </Section>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-true-black border-t border-dark-gray py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
                <p className="font-display text-2xl font-bold tracking-wider mb-6">仮想回路</p>
                <div className="flex justify-center space-x-6 mb-8">
                    <a href="#" aria-label="GitHub" className="text-off-white/70 hover:text-electric-blue transition-colors duration-300"><GithubIcon /></a>
                    <a href="#" aria-label="LinkedIn" className="text-off-white/70 hover:text-electric-blue transition-colors duration-300"><LinkedinIcon /></a>
                    <a href="#" aria-label="Twitter" className="text-off-white/70 hover:text-electric-blue transition-colors duration-300"><TwitterIcon /></a>
                </div>
                <p className="font-body text-xs text-off-white/50">&copy; {new Date().getFullYear()} VIRTUAL CIRCUIT. ALL RIGHTS RESERVED.</p>
                <p className="font-body text-xs text-off-white/50 mt-2">Made with ⚡ and a touch of the future.</p>
            </div>
        </footer>
    );
};


export default App;
