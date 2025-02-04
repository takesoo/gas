const BEARER_TOKEN = PropertiesService.getScriptProperties().getProperty('BEARER_TOKEN')

export function main() {
  if (!BEARER_TOKEN) {
    throw new Error('BEARER_TOKEN is not set.')
  }
  const response2 = UrlFetchApp.fetch('https://api.twitter.com/2/tweets/20', {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  })
  Logger.log(response2.getContentText())
}

