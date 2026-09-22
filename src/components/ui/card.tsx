import type { CardProps } from '@/types/ui.types';
import './card.css';

export default function Card({ cssName = '', children }: CardProps) {
  return <div className={`card ${cssName}`.trim()}>{children}</div>;
}
