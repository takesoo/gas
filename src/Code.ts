const SHEET_URL = `https://docs.google.com/spreadsheets/d/1_EJKBpSCL0Tt6VY9-k4QUu2b9anaQesohfKSoF4VzI4/edit`
const FILE_ID_INDEX_IN_URL = 5
const X_API_BASE_URL = 'https://api.x.com/2'
const CLIENT_ID = PropertiesService.getScriptProperties().getProperty('CLIENT_ID')
const CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET')

function getContentsFromSheet(): { text: string, imageUrl: string }[] {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0]
  const data = sheet.getDataRange().getValues()
  return data.map(row => ({
    text: row[0],
    imageUrl: row[1]
  }))
}

/**
 * Authorizes and makes a request to the Twitter API v2
 * OAuth 2.0 Making requests on behalf of users
 * https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
 */
function postTweet() {
  const service = getService_()
  if (!service.hasAccess()) {
    throw new Error('Access token is not set.')
  }
  const url = `${X_API_BASE_URL}/tweets`
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${service.getAccessToken()}`
    },
    contentType: 'application/json',
    payload: JSON.stringify({
      text: 'Post from Google Apps Script'
    })
  }
  const response = UrlFetchApp.fetch(url, options)
}

/**
 * Configures the service.
 */
function getService_() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('CLIENT_ID or CLIENT_SECRET is not set.')
  }
  return OAuth2.createService('X')
    .setAuthorizationBaseUrl('https://x.com/i/oauth2/authorize')
    .setTokenUrl('https://api.x.com/2/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    // コールバック関数名を設定
    .setCallbackFunction('authCallback')
    // アクセストークンを保持するプロパティストアを設定
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('tweet.write tweet.read media.write users.read')
    .generateCodeVerifier()
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    })
}

/**
 * Handles the OAuth callback.
 */
export function authCallback(request: Parameters<OAuth2.Service['handleCallback']>[0]) {
  const service = getService_()
  const isAuthorized = service.handleCallback(request)
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('認証が完了しました。')
  } else {
    return HtmlService.createHtmlOutput('認証に失敗しました。')
  }
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
        'Reopen the sidebar when the authorization is complete.');
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
  ui.createMenu('カスタムメニュー')
    .addItem('サイドバーを表示', 'showSidebar')
    .addToUi();
}

export function main() {
  // get tweet text and imageUrl from Google Sheets
  // const contents = getContentsFromSheet()

  // // choose content randomly
  // const content = contents[Math.floor(Math.random() * contents.length)]

  // // fetch image
  // const fileId = content.imageUrl.split('/')[FILE_ID_INDEX_IN_URL]
  // const imageBlob = DriveApp.getFileById(fileId).getBlob()
  // console.log(imageBlob)

  // authorize

  // upload image

  // postTweet
  postTweet()
}

