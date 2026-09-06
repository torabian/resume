import type { HttpRequest, HttpResponse, HttpStack } from "tus-js-client";

// tus-js-client's own DefaultHttpStack (lib/browser/httpStack.js) opens an
// XMLHttpRequest and only ever wires up `onload`/`onerror` - it never sets
// `xhr.timeout` and never listens for the dedicated `timeout` event. Browser
// XHRs never time themselves out by default, so a request whose connection
// goes silent mid-flight (dropped wifi, a laptop that slept, a dead TCP
// connection the OS hasn't noticed yet) just sits forever: neither `onload`
// nor `onerror` ever fires, tus-js-client's promise for that request never
// settles, and it has no way to know to retry - the whole upload appears to
// "hang" and needs a manual abort/restart. This stack is a drop-in
// replacement that fixes exactly that: it sets `xhr.timeout` and turns the
// `timeout` event into a rejection, which flows into tus-js-client's normal
// onError/onShouldRetry/retryDelays retry path like any other network error.
class TimeoutHttpRequest implements HttpRequest {
  private _xhr: XMLHttpRequest;
  private _method: string;
  private _url: string;
  private _headers: Record<string, string> = {};

  constructor(method: string, url: string, timeoutMs: number) {
    this._xhr = new XMLHttpRequest();
    this._xhr.open(method, url, true);
    // Must be set after open() and before send() per the XHR spec.
    this._xhr.timeout = timeoutMs;
    this._method = method;
    this._url = url;
  }

  getMethod(): string {
    return this._method;
  }

  getURL(): string {
    return this._url;
  }

  setHeader(header: string, value: string): void {
    this._xhr.setRequestHeader(header, value);
    this._headers[header] = value;
  }

  getHeader(header: string): string | undefined {
    return this._headers[header];
  }

  setProgressHandler(progressHandler: (bytesSent: number) => void): void {
    if (!("upload" in this._xhr)) return;
    this._xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      progressHandler(e.loaded);
    };
  }

  send(body?: unknown): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      this._xhr.onload = () => {
        resolve(new TimeoutHttpResponse(this._xhr));
      };
      this._xhr.onerror = (err) => {
        reject(err);
      };
      // The `timeout` event is distinct from `error` - a fired timeout does
      // NOT also fire `onerror`, so without this the send() promise would
      // still just hang forever even with `xhr.timeout` set above.
      this._xhr.ontimeout = () => {
        reject(
          new Error(
            `tus: request to ${this._url} timed out after ${this._xhr.timeout}ms`,
          ),
        );
      };
      this._xhr.send(body as XMLHttpRequestBodyInit | null | undefined);
    });
  }

  abort(): Promise<void> {
    this._xhr.abort();
    return Promise.resolve();
  }

  getUnderlyingObject(): XMLHttpRequest {
    return this._xhr;
  }
}

class TimeoutHttpResponse implements HttpResponse {
  constructor(private _xhr: XMLHttpRequest) {}

  getStatus(): number {
    return this._xhr.status;
  }

  getHeader(header: string): string | undefined {
    return this._xhr.getResponseHeader(header) ?? undefined;
  }

  getBody(): string {
    return this._xhr.responseText;
  }

  getUnderlyingObject(): XMLHttpRequest {
    return this._xhr;
  }
}

export class TimeoutHttpStack implements HttpStack {
  constructor(private timeoutMs: number) {}

  createRequest(method: string, url: string): HttpRequest {
    return new TimeoutHttpRequest(method, url, this.timeoutMs);
  }

  getName(): string {
    return "TimeoutXHRHttpStack";
  }
}
