'use client';

import type { ReactNode } from 'react';

import { ScrollReveal } from '@/components/motion/ScrollReveal';

type PhoneShowcaseStageProps = {
  children: ReactNode;
  className?: string;
  /** Gentle in-frame scroll demo for tall mockups */
  demonstrateScroll?: boolean;
  /** 3D tilt on hover (desktop) */
  tilt?: boolean;
  revealDelay?: number;
};

export function PhoneShowcaseStage({
  children,
  className = '',
  demonstrateScroll = false,
  tilt = true,
  revealDelay = 0,
}: PhoneShowcaseStageProps) {
  return (
    <ScrollReveal className={className} delay={revealDelay} scale>
      <div
        className={`phone-stage ${tilt ? 'phone-stage-tilt' : ''} ${demonstrateScroll ? 'mock-scroll-active' : ''}`}
      >
        <div className="phone-stage-inner">{children}</div>
      </div>
    </ScrollReveal>
  );
}
