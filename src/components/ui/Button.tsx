import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ink' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-glow disabled:opacity-50',
  ink: 'bg-text text-white hover:bg-[#1a120c] disabled:opacity-50',
  secondary:
    'bg-subtle2 text-text hover:bg-border disabled:opacity-50',
  outline:
    'bg-transparent text-text shadow-[inset_0_0_0_1px_var(--tw-shadow-color)] shadow-border-strong hover:bg-subtle disabled:opacity-50',
  ghost: 'bg-transparent text-text hover:bg-subtle disabled:opacity-50',
  danger:
    'bg-red text-white hover:bg-red/90 disabled:opacity-50',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-xs',
  md: 'h-10 px-[18px] text-sm',
  lg: 'h-12 px-[22px] text-[15px]',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...rest}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    )
  },
)
