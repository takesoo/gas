function authCallback () {
  return _entry.authCallback(...arguments);
};
function showSidebar () {
  return _entry.showSidebar(...arguments);
};
function onOpen () {
  return _entry.onOpen(...arguments);
};
function main () {
  return _entry.main(...arguments);
};
"use strict";
var _entry = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/Code.ts
  var Code_exports = {};
  __export(Code_exports, {
    authCallback: () => authCallback,
    main: () => main,
    onOpen: () => onOpen,
    showSidebar: () => showSidebar
  });
  var X_API_BASE_URL = "https://api.x.com/2";
  var CLIENT_ID = PropertiesService.getScriptProperties().getProperty("CLIENT_ID");
  var CLIENT_SECRET = PropertiesService.getScriptProperties().getProperty("CLIENT_SECRET");
  function postTweet() {
    const service = getService_();
    if (!service.hasAccess()) {
      throw new Error("Access token is not set.");
    }
    const url = `${X_API_BASE_URL}/tweets`;
    const options = {
      method: "post",
      headers: {
        Authorization: `Bearer ${service.getAccessToken()}`
      },
      contentType: "application/json",
      payload: JSON.stringify({
        text: "Post from Google Apps Script"
      })
    };
    const response = UrlFetchApp.fetch(url, options);
  }
  function getService_() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error("CLIENT_ID or CLIENT_SECRET is not set.");
    }
    return OAuth2.createService("X").setAuthorizationBaseUrl("https://x.com/i/oauth2/authorize").setTokenUrl("https://api.x.com/2/oauth2/token").setClientId(CLIENT_ID).setClientSecret(CLIENT_SECRET).setCallbackFunction("authCallback").setPropertyStore(PropertiesService.getUserProperties()).setScope("tweet.write tweet.read media.write users.read").generateCodeVerifier().setTokenHeaders({
      "Authorization": "Basic " + Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded"
    });
  }
  function authCallback(request) {
    const service = getService_();
    const isAuthorized = service.handleCallback(request);
    if (isAuthorized) {
      return HtmlService.createHtmlOutput("\u8A8D\u8A3C\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002");
    } else {
      return HtmlService.createHtmlOutput("\u8A8D\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
    }
  }
  function showSidebar() {
    var service = getService_();
    if (!service.hasAccess()) {
      var authorizationUrl = service.getAuthorizationUrl();
      var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. Reopen the sidebar when the authorization is complete.'
      );
      template.authorizationUrl = authorizationUrl;
      var page = template.evaluate();
      SpreadsheetApp.getUi().showSidebar(page);
    } else {
    }
  }
  function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("\u30AB\u30B9\u30BF\u30E0\u30E1\u30CB\u30E5\u30FC").addItem("\u30B5\u30A4\u30C9\u30D0\u30FC\u3092\u8868\u793A", "showSidebar").addToUi();
  }
  function main() {
    postTweet();
  }
  return __toCommonJS(Code_exports);
})();
