/// <reference types="google-apps-script" />

/**
 * Type definitions for the OAuth2 for Apps Script library.
 * Project: https://github.com/googleworkspace/apps-script-oauth2
 */

declare namespace OAuth2 {
  /**
   * OAuth2 のサービスオブジェクト。各種設定メソッドや認証・トークン取得メソッドを提供します。
   */
  interface Service {
    setAuthorizationBaseUrl(url: string): Service;
    setTokenUrl(url: string): Service;
    setRefreshUrl(url: string): Service;
    setTokenFormat(tokenFormat: string): Service;
    setTokenHeaders(tokenHeaders: { [header: string]: string }): Service;
    setTokenMethod(tokenMethod: string): Service;
    /**
     * ※ 注意: ライブラリ内部では「setCodeVerififer」という名称になっています。
     */
    setCodeVerififer(codeVerifier: string): Service;
    generateCodeVerifier(): Service;
    setCodeChallengeMethod(method: string): Service;
    setTokenPayloadHandler(tokenHandler: (payload: any) => any): Service;
    setCallbackFunction(callbackFunctionName: string): Service;
    setClientId(clientId: string): Service;
    setClientSecret(clientSecret: string): Service;
    setPropertyStore(propertyStore: GoogleAppsScript.Properties.Properties): Service;
    setCache(cache: GoogleAppsScript.Cache.Cache): Service;
    setLock(lock: GoogleAppsScript.Lock.Lock): Service;
    setScope(scope: string | string[], optSeparator?: string): Service;
    setParam(name: string, value: string): Service;
    setPrivateKey(privateKey: string): Service;
    setIssuer(issuer: string): Service;
    setAdditionalClaims(additionalClaims: { [key: string]: string }): Service;
    setSubject(subject: string): Service;
    setExpirationMinutes(expirationMinutes: number): Service;
    setGrantType(grantType: string): Service;
    setRedirectUri(redirectUri: string): Service;
    getRedirectUri(): string;
    getAuthorizationUrl(optAdditionalParameters?: { [key: string]: string }): string;
    handleCallback(callbackRequest: { parameter: { [key: string]: string } }): boolean;
    hasAccess(): boolean;
    getAccessToken(): string;
    getIdToken(): string;
    reset(): void;
    getLastError(): any;
    refresh(): void;
    getStorage(): Storage;
  }

  /**
   * トークンや関連データの永続化に用いるストレージのインターフェイスです。
   */
  interface Storage {
    setValue(key: string | null, value: any): void;
    getValue(key: string | null, optSkipMemoryCheck?: boolean): any;
    reset(): void;
  }

  /**
   * 指定したサービス名で新しい OAuth2 サービスオブジェクトを作成します。
   * @param serviceName サービス名（プロパティストア内での識別に使用されます）。
   */
  function createService(serviceName: string): Service;

  /**
   * 指定したスクリプト ID（または現在実行中のスクリプト）のリダイレクト URI を返します。
   * @param optScriptId オプション。スクリプト ID。省略時は現在のスクリプト ID が使用されます。
   */
  function getRedirectUri(optScriptId?: string): string;

  /**
   * 指定したプロパティストア内に保存されたサービス名の一覧を取得します。
   * @param propertyStore プロパティストア（例: PropertiesService.getUserProperties()）。
   */
  function getServiceNames(propertyStore: GoogleAppsScript.Properties.Properties): string[];

  /**
   * トークンのフォーマットに関する定数。
   */
  const TOKEN_FORMAT: {
    JSON: string;
    FORM_URL_ENCODED: string;
  };
}
