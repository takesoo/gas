import { X_API_BASE_URL } from "./constants";
import { getService_ } from "./auth";

function convertToJsBlob(imageBlob: GoogleAppsScript.Base.Blob) {
  return Utilities.newBlob(
    imageBlob.getBytes(),
    imageBlob.getContentType() ?? "",
    imageBlob.getName() ?? "",
  );
}

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

/**
 * Authorizes and makes a request to the Twitter API v2
 * OAuth 2.0 Making requests on behalf of users
 * https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
 */
export function postTweet(text: string, mediaId: string) {
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
