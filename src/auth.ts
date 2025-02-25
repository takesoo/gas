import { CLIENT_ID, CLIENT_SECRET } from "./constants";

export function getService_() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("CLIENT_ID or CLIENT_SECRET is not set.");
  }
  return OAuth2.createService("X")
    .setAuthorizationBaseUrl("https://x.com/i/oauth2/authorize")
    .setTokenUrl("https://api.x.com/2/oauth2/token")
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("tweet.write tweet.read media.write users.read offline.access")
    .generateCodeVerifier()
    .setTokenHeaders({
      Authorization:
        "Basic " + Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    });
}

export function authCallback(
  request: Parameters<OAuth2.Service["handleCallback"]>[0],
) {
  const service = getService_();
  const isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("認証が完了しました。");
  } else {
    return HtmlService.createHtmlOutput("認証に失敗しました。");
  }
}

export function logout() {
  let service = getService_();
  service.reset();
}

export function showSidebar() {
  let service = getService_();
  if (!service.hasAccess()) {
    let authorizationUrl = service.getAuthorizationUrl();
    let template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. Reopen the sidebar when the authorization is complete.',
    );
    template.authorizationUrl = authorizationUrl;
    let page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page);
  }
}
