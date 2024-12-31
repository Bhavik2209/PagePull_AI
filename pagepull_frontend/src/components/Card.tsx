import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#151A2D]/60 backdrop-blur-md rounded-2xl border border-[#2A3147] shadow-xl ${className}`}>
      {children}
    </div>
  );
}