import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost';

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClass =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold tracking-[-0.01em] transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mizora-ink/20 focus-visible:ring-offset-2';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-mizora-lime text-mizora-ink shadow-[0_1px_0_rgba(20,28,18,0.06)] hover:brightness-[0.98] active:scale-[0.98]',
  ghost: 'bg-transparent text-mizora-ink-strong hover:bg-black/[0.03] active:scale-[0.98]',
};

function classNames(variant: ButtonVariant, className: string) {
  return `${baseClass} ${variants[variant]} ${className}`;
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '', ...rest } = props;

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    const isExternal = href.startsWith('http');

    if (isExternal || href.startsWith('#')) {
      return (
        <a
          href={href}
          className={classNames(variant, className)}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classNames(variant, className)} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonAsButton;

  return (
    <button type={type} className={classNames(variant, className)} {...buttonRest}>
      {children}
    </button>
  );
}
