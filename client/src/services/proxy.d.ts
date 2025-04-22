// TypeScript declaration for proxy module
interface MockResponse extends Response {
  clone(): MockResponse;
}

// Global fetch patch
declare global {
  interface Window {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  }
}

export {}; 