// Type declarations for qr-scanner
declare module 'qr-scanner' {
  interface QrScannerOptions {
    highlightScanRegion?: boolean;
    highlightCodeOutline?: boolean;
    preferredCamera?: 'environment' | 'user';
  }

  interface QrScannerResult {
    data: string;
  }

  class QrScanner {
    constructor(
      video: HTMLVideoElement,
      onDecode: (result: QrScannerResult) => void,
      options?: QrScannerOptions
    );

    static hasCamera(): boolean;
    start(): Promise<void>;
    stop(): void;
    destroy(): void;
    toggleFlash(): Promise<void>;
  }

  export default QrScanner;
}
