import type { ButtonProps } from '@/types/ui.types';
import './button.css';

export default function Button({ className = '', type = 'button', ...props }: ButtonProps) {
  return <button {...props} className={`button ${className}`.trim()} type={type} />;
}
