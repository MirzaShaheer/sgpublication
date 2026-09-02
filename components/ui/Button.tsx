import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Buttons say what happens. The visual treatment lives in the .btn classes in
 * globals.css, so gold stays an edge rather than a fill: the primary action is
 * the bark field with a gold hairline stamped inside it.
 */

export type ButtonVariant =
  | 'primary'
  | 'primary-on-dark'
  | 'secondary'
  | 'quiet'
export type ButtonSize = 'md' | 'lg'

function classesFor(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return [
    'btn',
    `btn-${variant}`,
    variant === 'quiet' ? '' : `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonLinkProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={classesFor(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} & ComponentProps<'button'>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classesFor(variant, size, className)}
      {...rest}
    >
      {children}
    </button>
  )
}
