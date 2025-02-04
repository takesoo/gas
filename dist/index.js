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

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    main: () => main
  });
  var BEARER_TOKEN = PropertiesService.getScriptProperties().getProperty("BEARER_TOKEN");
  function main() {
    if (!BEARER_TOKEN) {
      throw new Error("BEARER_TOKEN is not set.");
    }
    const response2 = UrlFetchApp.fetch("https://api.twitter.com/2/tweets/20", {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });
    Logger.log(response2.getContentText());
  }
  return __toCommonJS(index_exports);
})();
