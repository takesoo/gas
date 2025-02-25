import { FILE_ID_INDEX_IN_URL } from "./constants";
import { getContentsFromSheet } from "./sheet";
import { uploadImage, postTweet } from "./tweet";

export function main() {
  const contents = getContentsFromSheet();
  const content = contents[Math.floor(Math.random() * contents.length)];
  const fileId = content.imageUrl.split("/")[FILE_ID_INDEX_IN_URL];
  const imageBlob = DriveApp.getFileById(fileId).getBlob();
  const mediaId = uploadImage(imageBlob);
  postTweet(content.text, mediaId);
}
