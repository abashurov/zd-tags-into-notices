import tinApp from '../modules/app'

/* global ZAFClient */
var client = ZAFClient.init()

client.on('app.registered', _ => tinApp(client, true))
client.on('user.tags.changed', _ => tinApp(client))
client.on('pane.activated', _ => tinApp(client))
client.on('app.activated', _ => tinApp(client))
