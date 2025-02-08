const BEARER_TOKEN = PropertiesService.getScriptProperties().getProperty('BEARER_TOKEN')
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1_EJKBpSCL0Tt6VY9-k4QUu2b9anaQesohfKSoF4VzI4/edit'
const FILE_ID_INDEX_IN_URL = 5

function getContentsFromSheet(): { text: string, imageUrl: string }[] {
  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0]
  const data = sheet.getDataRange().getValues()
  return data.map(row => ({
    text: row[0],
    imageUrl: row[1]
  }))
}

export function main() {
  if (!BEARER_TOKEN) {
    throw new Error('BEARER_TOKEN is not set.')
  }
  // get tweet text and imageUrl from Google Sheets
  const contents = getContentsFromSheet()

  // choose content randomly
  const content = contents[Math.floor(Math.random() * contents.length)]

  // fetch image
  const fileId = content.imageUrl.split('/')[FILE_ID_INDEX_IN_URL]
  const imageBlob = DriveApp.getFileById(fileId).getBlob()
  console.log(imageBlob)

  // upload image
  const formData = { image: imageBlob }
  console.log(formData)
  const uploadResponse = UrlFetchApp.fetch('https://api.x.com/2/media/upload', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'Content-Type': 'multipart/form-data'
    },
    payload: formData
  })
  console.log(uploadResponse)

  // const imageData = JSON.parse(imageResponse.getContentText())
  // const mediaId = imageData.data.id

  // // postTweet
  // const tweetResponse = UrlFetchApp.fetch('https://api.twitter.com/2/tweets', {
  //   method: 'post',
  //   contentType: 'application/json',
  //   headers: {
  //     Authorization: `Bearer ${BEARER_TOKEN}`
  //   },
  //   payload: JSON.stringify({
  //     status: content.text,
  //     media_ids: [mediaId]
  //   })
  // })

  // Logger.log(tweetResponse.getContentText())
}

