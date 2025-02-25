import { SHEET_URL } from "./constants";

export function getContentsFromSheet(): { text: string; imageUrl: string }[] {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  return data.map((row) => ({
    text: row[0],
    imageUrl: row[1],
  }));
}

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("カスタムメニュー")
    .addItem("サイドバーを表示", "showSidebar")
    .addToUi();
}
