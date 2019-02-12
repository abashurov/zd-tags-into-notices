import tinApp from '../modules/app'

/* global ZAFClient */
var client = ZAFClient.init()

client.on('app.registered', function (appData) {
  return tinApp(client, appData)
})

client.on('ticket.tags.changed', function (appData) {
  return tinApp(client, appData)
})
