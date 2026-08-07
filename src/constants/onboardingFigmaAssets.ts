export const onboardingFigmaCollage = {
  mainWalk: require('../../assets/onboarding/figma/collage-main-walk.jpg'),
  topRight: require('../../assets/onboarding/figma/collage-top-right.jpg'),
  bottomLeft: require('../../assets/onboarding/figma/collage-bottom-left.jpg'),
  bottomRight: require('../../assets/onboarding/figma/collage-bottom-right.jpg'),
} as const;

/** Figma `Main_home` / `2nd-screen` brand lime */
export const FIGMA_ONBOARDING_LIME = '#C1FD3A';

export const FIGMA_ONBOARDING_FRAME_W = 393;
export const FIGMA_ONBOARDING_FRAME_H = 852;

/** Android onboarding cards — flat fill (no blur/shadow). iOS uses glass blur. */
export const ONBOARDING_ANDROID_CARD = {
  fill: '#EAFFBD',
  border: '#D6D6D6',
  borderWidth: 0.7,
} as const;
