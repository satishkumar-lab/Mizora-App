/** Lets retry/sync request the OS permission sheet (vs. pending-only probe). */
let requestPermissionOnNextSync = false;

export function setRequestStepPermissionOnNextSync(enabled: boolean): void {
  requestPermissionOnNextSync = enabled;
}

export function consumeRequestStepPermissionOnNextSync(): boolean {
  const value = requestPermissionOnNextSync;
  requestPermissionOnNextSync = false;
  return value;
}
