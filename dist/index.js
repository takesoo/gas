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
  var SHEET_URL = "https://docs.google.com/spreadsheets/d/1_EJKBpSCL0Tt6VY9-k4QUu2b9anaQesohfKSoF4VzI4/edit";
  var FILE_ID_INDEX_IN_URL = 5;
  function getContentsFromSheet() {
    const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0];
    const data = sheet.getDataRange().getValues();
    return data.map((row) => ({
      text: row[0],
      imageUrl: row[1]
    }));
  }
  function main() {
    if (!BEARER_TOKEN) {
      throw new Error("BEARER_TOKEN is not set.");
    }
    const contents = getContentsFromSheet();
    const content = contents[Math.floor(Math.random() * contents.length)];
    const fileId = content.imageUrl.split("/")[FILE_ID_INDEX_IN_URL];
    const imageBlob = DriveApp.getFileById(fileId).getBlob();
    console.log(imageBlob);
    const formData = { image: imageBlob };
    console.log(formData);
    const uploadResponse = UrlFetchApp.fetch("https://api.x.com/2/media/upload", {
      method: "post",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "multipart/form-data"
      },
      payload: formData
    });
    console.log(uploadResponse);
  }
  return __toCommonJS(index_exports);
})();
