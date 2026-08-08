/** Dev-only gate so weekly report demo can open `/rewards/impact` while V2 flag is off. */
let impactPreviewEnabled = false;

export function setDemoWeeklyImpactPreviewEnabled(enabled: boolean): void {
  if (!__DEV__) return;
  impactPreviewEnabled = enabled;
}

export function isDemoWeeklyImpactPreviewEnabled(): boolean {
  return __DEV__ && impactPreviewEnabled;
}
