import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
      <Card className="p-6 group hover:border-indigo-500/50 transition-all duration-300 flex flex-col items-center justify-center text-center">
        <Icon className="w-12 h-12 mb-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </Card>
    );
  }
  