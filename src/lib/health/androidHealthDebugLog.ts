/** __DEV__-only health pipeline markers — no analytics, no PII. */
export type AndroidHealthDebugEvent =
  | 'HealthConnect_Available'
  | 'HealthConnect_NotInstalled'
  | 'HealthConnect_UpdateRequired'
  | 'ActivityRecognition_Request'
  | 'ActivityRecognition_Granted'
  | 'ActivityRecognition_Denied'
  | 'ReadSteps_Request'
  | 'ReadSteps_Granted'
  | 'ReadSteps_Denied'
  | 'Aggregate_Success'
  | 'Aggregate_Failed'
  | 'Sync_Started'
  | 'Sync_Completed'
  | 'Sync_Error'
  | 'Resume_From_Settings'
  | 'Resume_From_PlayStore'
  | 'Provider_Ready';

const TAG = '[MizoraHealth]';

export function logAndroidHealthDebug(event: AndroidHealthDebugEvent, detail?: string): void {
  if (!__DEV__) {
    return;
  }
  if (detail) {
    console.log(`${TAG} ${event} (${detail})`);
  } else {
    console.log(`${TAG} ${event}`);
  }
}
