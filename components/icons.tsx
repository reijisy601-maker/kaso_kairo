import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CodeIcon: React.FC = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export const PenToolIcon: React.FC = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
  </svg>
);

export const GithubIcon: React.FC = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export const LinkedinIcon: React.FC = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const MailIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

export const ReactIcon: React.FC = () => (
    <svg {...iconProps} viewBox="-11.5 -10.23174 23 20.46348">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none"></circle>
        <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
        </g>
    </svg>
);

export const TypeScriptIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M14.5 10.1h-3.2v9.7h-2.5V10.1H5.6v-2.2h8.9v2.2zM21.2 14c.4 1.3.6 2.3.6 3.2 0 1.3-.3 2.3-1 3.1s-1.6.8-2.9.8c-1.2 0-2.3-.3-3.2-.8-.9-.5-1.5-1.3-1.9-2.3l2.2-.9c.3.6.8 1 1.3 1.3.5.3 1.1.4 1.7.4.7 0 1.2-.2 1.6-.5.4-.3.5-.8.5-1.4 0-.4 0-.8-.2-1.3l-2.4-5.8h2.6l1.5 3.8 1.4-3.8h2.3l-2.2 5.9z" />
    </svg>
);
