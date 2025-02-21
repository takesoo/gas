declare namespace FetchApp {
  interface FetchParams {
    method?: 'get' | 'delete' | 'patch' | 'post' | 'put';
    contentType?: string;
    payload?: any;
    headers?: { [key: string]: string };
    muteHttpExceptions?: boolean;
    followRedirects?: boolean;
    validateHttpsCertificates?: boolean;
    body?: FormData;
  }

  interface FormData {
    append(name: string, value: string | Blob, filename?: string): void;
  }

  function fetch(url: string, params?: FetchParams): GoogleAppsScript.URL_Fetch.HTTPResponse;
  function createFormData(): FormData;
}
