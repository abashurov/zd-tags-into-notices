import tinApp from '../modules/app'

/* global ZAFClient */
var client = ZAFClient.init()

client.on('app.registered', () => tinApp(client, true))
client.on('user.tags.changed', () => tinApp(client))
client.on('pane.activated', () => tinApp(client))
client.on('app.activated', () => tinApp(client))
