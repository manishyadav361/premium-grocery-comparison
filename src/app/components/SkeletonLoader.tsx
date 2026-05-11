import React from 'react';

const shimmer = `
  relative overflow-hidden before:absolute before:inset-0 
  before:-translate-x-full before:animate-[shimmer_1.5s_infinite] 
  before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
`;

export const SkeletonProductCard: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className={`h-36 bg-gray-100 ${shimmer}`} />
    <div className="p-3 space-y-2">
      <div className={`h-2.5 w-16 bg-gray-100 rounded-full ${shimmer}`} />
      <div className={`h-3.5 w-full bg-gray-100 rounded-full ${shimmer}`} />
      <div className={`h-3 w-3/4 bg-gray-100 rounded-full ${shimmer}`} />
      <div className={`h-5 w-20 bg-gray-100 rounded-full ${shimmer}`} />
    </div>
  </div>
);

export const SkeletonListItem: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden p-3">
    <div className="flex gap-3">
      <div className={`w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 ${shimmer}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-2.5 w-12 bg-gray-100 rounded-full ${shimmer}`} />
        <div className={`h-3.5 w-full bg-gray-100 rounded-full ${shimmer}`} />
        <div className={`h-3 w-2/3 bg-gray-100 rounded-full ${shimmer}`} />
        <div className={`h-5 w-16 bg-gray-100 rounded-full ${shimmer}`} />
      </div>
    </div>
  </div>
);

export const SkeletonText: React.FC<{ width?: string; height?: string }> = ({
  width = 'w-full',
  height = 'h-3',
}) => (
  <div className={`${height} ${width} bg-gray-100 rounded-full ${shimmer}`} />
);

export const SkeletonSearchItem: React.FC = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className={`w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0 ${shimmer}`} />
    <div className="flex-1 space-y-1.5">
      <div className={`h-3.5 w-3/4 bg-gray-100 rounded-full ${shimmer}`} />
      <div className={`h-2.5 w-1/2 bg-gray-100 rounded-full ${shimmer}`} />
    </div>
  </div>
);

// Add keyframe to global
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `;
  if (!document.head.querySelector('[data-shimmer]')) {
    style.setAttribute('data-shimmer', '');
    document.head.appendChild(style);
  }
}
