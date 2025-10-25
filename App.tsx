import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOnScreen } from './hooks/useOnScreen';
import { GithubIcon, LinkedinIcon, MailIcon, ReactIcon, TypeScriptIcon, CodeIcon, PenToolIcon } from './components/icons';

// --- Types ---
interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  label: string;
  detail: string;
}
interface Edge {
  from: number;
  to: number;
}
interface TechStackItem {
  icon: React.ReactNode;
  name: string;
  description: string;
}

// --- Constants & Data ---
const techNodes: Node[] = [
  { id: 0, x: 0, y: 0, radius: 40, label: "仮想回路", detail: "中心核：創造性と技術の融合点。ここから全てのプロジェクトが始まります。" },
  { id: 1, x: 0, y: -150, radius: 25, label: "React", detail: "宣言的なUI構築のための主要ライブラリ。最新のReact 19機能にも対応。" },
  { id: 2, x: 130, y: -75, radius: 25, label: "TypeScript", detail: "静的型付けによる大規模開発の安定性と保守性を確保します。" },
  { id: 3, x: 130, y: 75, radius: 25, label: "Canvas API", detail: "本サイトのヒーロー部でも使用。高度なグラフィックスとアニメーションを実装。" },
  { id: 4, x: 0, y: 150, radius: 25, label: "Node.js", detail: "サーバーサイド開発。API構築からビルドプロセスまで幅広く活用。" },
  { id: 5, x: -130, y: 75, radius: 25, label: "Performance", detail: "パフォーマンス最適化。60fpsのアニメーション、高速なロード速度を追求。" },
  { id: 6, x: -130, y: -75, radius: 25, label: "UI/UX", detail: "ユーザー体験の設計。直感的で美しく、目的を達成できるデザイン。" },
];
const edges: Edge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
  { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
  { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 1 },
];
const techStackData: TechStackItem[] = [
    { icon: <ReactIcon />, name: "Frontend", description: "React, Next.js, TypeScript, Tailwind CSS" },
    { icon: <CodeIcon />, name: "Backend", description: "Node.js, Express, NestJS, Python" },
    { icon: <PenToolIcon />, name: "Design & UI", description: "Figma, Canvas API, WebGL, Framer Motion" },
];
const interactiveNodeIds = techNodes.filter(n => n.id !== 0).map(n => n.id);

// --- Canvas Circuit Component ---
const CircuitCanvas: React.FC<{ onNodeClick: (node: Node) => void }> = ({ onNodeClick }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
    const [focusedNodeId, setFocusedNodeId] = useState<number | null>(null);

    const handleNodeInteraction = useCallback((nodeId: number | null) => {
        if (nodeId !== null) {
            const node = techNodes.find(n => n.id === nodeId);
            if (node) onNodeClick(node);
        }
    }, [onNodeClick]);
    
    // Event listeners setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getPointerPosition = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const touch = 'touches' in e ? e.touches[0] : e;
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        };

        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            const pos = getPointerPosition(e);
            const { width, height } = canvas.getBoundingClientRect();
            const center = { x: width / 2, y: height / 2 };
            
            let currentlyHovered: Node | null = null;
            for (const node of techNodes) {
                const dist = Math.hypot(pos.x - (center.x + node.x), pos.y - (center.y + node.y));
                if (dist < node.radius) {
                    currentlyHovered = node;
                    break;
                }
            }
            setHoveredNodeId(currentlyHovered ? currentlyHovered.id : null);
        };
        
        const handlePointerUp = () => handleNodeInteraction(hoveredNodeId);
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNodeInteraction(focusedNodeId);
            } else if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                const currentIndex = interactiveNodeIds.indexOf(focusedNodeId ?? -1);
                let nextIndex;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIndex = currentIndex >= interactiveNodeIds.length - 1 ? 0 : currentIndex + 1;
                } else { // ArrowLeft or ArrowUp
                    nextIndex = currentIndex <= 0 ? interactiveNodeIds.length - 1 : currentIndex - 1;
                }
                setFocusedNodeId(interactiveNodeIds[nextIndex]);
            }
        };
        
        const handleFocus = () => {
            if (focusedNodeId === null) setFocusedNodeId(interactiveNodeIds[0]);
        };
        const handleBlur = () => setFocusedNodeId(null);

        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
        canvas.addEventListener('click', handlePointerUp);
        canvas.addEventListener('touchend', handlePointerUp);
        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('focus', handleFocus);
        canvas.addEventListener('blur', handleBlur);

        return () => {
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('click', handlePointerUp);
            canvas.removeEventListener('touchend', handlePointerUp);
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('focus', handleFocus);
            canvas.removeEventListener('blur', handleBlur);
        };
    }, [hoveredNodeId, focusedNodeId, handleNodeInteraction]);

    // Drawing effect
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const center = { x: rect.width / 2, y: rect.height / 2 };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Edges
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1;
        edges.forEach(edge => {
            const fromNode = techNodes.find(n => n.id === edge.from);
            const toNode = techNodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;
            ctx.beginPath();
            ctx.moveTo(center.x + fromNode.x, center.y + fromNode.y);
            ctx.lineTo(center.x + toNode.x, center.y + toNode.y);
            ctx.stroke();
        });
        
        // Draw Nodes
        techNodes.forEach(node => {
            const isHovered = node.id === hoveredNodeId;
            const isFocused = node.id === focusedNodeId;

            ctx.beginPath();
            ctx.arc(center.x + node.x, center.y + node.y, node.radius, 0, 2 * Math.PI);
            ctx.fillStyle = isHovered ? '#0066FF' : '#0A0A0A';
            ctx.strokeStyle = isHovered || isFocused ? '#0066FF' : '#1A1A1A';
            ctx.lineWidth = isHovered || isFocused ? 2 : 1;
            
            if (isHovered) {
              ctx.shadowColor = 'rgba(0, 102, 255, 0.7)';
              ctx.shadowBlur = 15;
            } else {
              ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            ctx.stroke();

            // Draw focus ring
            if (isFocused && !isHovered) {
                ctx.strokeStyle = '#0066FF';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(center.x + node.x, center.y + node.y, node.radius + 4, 0, 2 * Math.PI);
                ctx.stroke();
            }

            ctx.fillStyle = (isHovered || isFocused) ? '#FFFFFF' : '#999999';
            ctx.font = `${node.id === 0 ? '16' : '12'}px "JetBrains Mono"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, center.x + node.x, center.y + node.y);
        });
    }, [hoveredNodeId, focusedNodeId]);

    return <canvas ref={canvasRef} tabIndex={0} className="absolute top-0 left-0 w-full h-full cursor-pointer focus:outline-none" />;
};

// --- Hero Component ---
const Hero: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    return (
        <section className="h-screen w-full relative flex flex-col items-center justify-center">
            <CircuitCanvas onNodeClick={(node) => setSelectedNode(node)} />
            <div className="z-10 text-center pointer-events-none">
                <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tighter">
                    仮想回路
                </h1>
                <p className="font-body text-text-secondary mt-2">Web Developer / Creative Technologist</p>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 font-body text-xs text-text-secondary uppercase tracking-widest flex flex-col items-center space-y-2">
                <span>Explore Tech Stack</span>
                <div className="w-px h-8 bg-accent animate-pulse"></div>
            </div>
            
            {/* Modal */}
            {selectedNode && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setSelectedNode(null)}>
                    <div className="bg-surface border border-border p-8 max-w-sm w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-semibold text-accent mb-2">{selectedNode.label}</h2>
                        <p className="font-body text-text-secondary leading-relaxed">{selectedNode.detail}</p>
                        <button onClick={() => setSelectedNode(null)} className="font-body text-xs uppercase tracking-widest mt-6 bg-border px-4 py-2 hover:bg-accent hover:text-white transition-colors duration-300">
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

// --- TechStack Component ---
const TechStack: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isOnScreen = useOnScreen(ref, { threshold: 0.2 });

    return (
        <section ref={ref} className={`py-24 px-6 max-w-4xl mx-auto transition-opacity duration-1000 ${isOnScreen ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-center font-display text-4xl font-semibold mb-12">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {techStackData.map((item, index) => (
                    <div key={index} className="bg-surface p-6 border border-border hover:border-accent transition-colors duration-300">
                        <div className="text-accent mb-3">{item.icon}</div>
                        <h3 className="font-display text-xl font-semibold mb-1">{item.name}</h3>
                        <p className="font-body text-sm text-text-secondary">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- Footer Component ---
const Footer: React.FC = () => {
    return (
        <footer className="py-12 border-t border-border">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="flex justify-center space-x-6 mb-6">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-text-secondary hover:text-accent transition-colors duration-300"><GithubIcon /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-secondary hover:text-accent transition-colors duration-300"><LinkedinIcon /></a>
                    <a href="mailto:contact@virtual-circuit.dev" aria-label="Email" className="text-text-secondary hover:text-accent transition-colors duration-300"><MailIcon /></a>
                </div>
                <p className="font-body text-xs text-text-secondary/70">&copy; {new Date().getFullYear()} 仮想回路 / VIRTUAL CIRCUIT. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
};

// --- Main App Component ---
const App: React.FC = () => {
  return (
    <div className="bg-background">
      <main>
        <Hero />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default App;