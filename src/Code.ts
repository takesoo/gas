const SHEET_URL = `https://docs.google.com/spreadsheets/d/145Kcng-af2dq3LKuAk9QBY5rLLXK7MM8SbU5rLi5z3s/edit?gid=0#gid=0`;
const FILE_ID_INDEX_IN_URL = 5;
const X_API_BASE_URL = "https://api.x.com/2";
const CLIENT_ID =
  PropertiesService.getScriptProperties().getProperty("CLIENT_ID");
const CLIENT_SECRET =
  PropertiesService.getScriptProperties().getProperty("CLIENT_SECRET");

function getContentsFromSheet(): { text: string; imageUrl: string }[] {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  return data.map((row) => ({
    text: row[0],
    imageUrl: row[1],
  }));
}

/**
 * Authorizes and makes a request to the Twitter API v2
 * OAuth 2.0 Making requests on behalf of users
 * https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
 */
function postTweet(text: string, mediaId: string) {
  const service = getService_();
  if (!service.hasAccess()) {
    throw new Error("Access token is not set.");
  }
  const url = `${X_API_BASE_URL}/tweets`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      Authorization: `Bearer ${service.getAccessToken()}`,
    },
    contentType: "application/json",
    payload: JSON.stringify({
      text,
      media: {
        media_ids: [mediaId],
      },
    }),
  };
  UrlFetchApp.fetch(url, options);
}

/**
 * Configures the service.
 */
function getService_() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("CLIENT_ID or CLIENT_SECRET is not set.");
  }
  return (
    OAuth2.createService("X")
      .setAuthorizationBaseUrl("https://x.com/i/oauth2/authorize")
      .setTokenUrl("https://api.x.com/2/oauth2/token")
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)
      // コールバック関数名を設定
      .setCallbackFunction("authCallback")
      // アクセストークンを保持するプロパティストアを設定
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope("tweet.write tweet.read media.write users.read offline.access")
      .generateCodeVerifier()
      .setTokenHeaders({
        Authorization:
          "Basic " + Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded",
      })
  );
}

/**
 * Handles the OAuth callback.
 */
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

/**
 * Reset the authorization state, so that it can be re-tested.
 */
export function logout() {
  var service = getService_();
  service.reset();
}

/**
 * Unauthorizes the service by revoking all tokens and removing
 * the authorization URL.
 */
export function showSidebar() {
  var service = getService_();
  if (!service.hasAccess()) {
    var authorizationUrl = service.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
      '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        "Reopen the sidebar when the authorization is complete.",
    );
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page);
  } else {
    // ...
  }
}

/**
 * revoke this function on open spreadsheet
 * append custom menu on spreadsheet header
 */
export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("カスタムメニュー")
    .addItem("サイドバーを表示", "showSidebar")
    .addToUi();
}

function convertToJsBlob(imageBlob: GoogleAppsScript.Base.Blob) {
  return Utilities.newBlob(
    imageBlob.getBytes(),
    imageBlob.getContentType() ?? "",
    imageBlob.getName() ?? "",
  );
}

/**
 * upload image to Twitter
 */
export function uploadImage(imageBlob: GoogleAppsScript.Base.Blob) {
  const service = getService_();
  if (!service.hasAccess()) {
    throw new Error("Access token is not set.");
  }
  const url = `${X_API_BASE_URL}/media/upload`;
  const jsBlob = convertToJsBlob(imageBlob);
  const form = FetchApp.createFormData();
  form.append("media", jsBlob as unknown as Blob);
  const options: FetchApp.FetchParams = {
    method: "post",
    headers: {
      Authorization: `Bearer ${service.getAccessToken()}`,
      "Content-Type": "multipart/form-data",
    },
    body: form,
  };
  const response = FetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  return data.id;
}

export function main() {
  // get tweet text and imageUrl from Google Sheets
  const contents = getContentsFromSheet();

  // choose content randomly
  const content = contents[Math.floor(Math.random() * contents.length)];

  // // fetch image
  const fileId = content.imageUrl.split("/")[FILE_ID_INDEX_IN_URL];
  const imageBlob = DriveApp.getFileById(fileId).getBlob();
  // upload image
  const mediaId = uploadImage(imageBlob);

  // postTweet
  postTweet(content.text, mediaId);
}
