import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, render } from '../../javascripts/lib/helpers'
import getPreloadTemplate from '../../templates/preload'
import getDefaultTemplate from '../../templates/default'
const MAX_HEIGHT = 1000

const tinApp = async (client, initial = false) => {
  if (initial) {
    await init(client).catch(e => handleError(e))
  }
  await fullRender(client)
}

const init = async (client) => {
  const currentUser = (await client.get('currentUser')).currentUser
  I18n.loadTranslations(currentUser.locale)
  render('.loader', getPreloadTemplate())
  await fullRender(client).catch(e => handleError(e))
}

const fullRender = async (client) => {
  const tags = await extractTags(client).catch(e => handleError(e))
  const settings = await client.metadata().catch(e => handleError(e))
  if (Boolean(tags) && Boolean(settings)) {
    render('.app', getDefaultTemplate({ "tags": tags, "settings": settings.settings }))
    return resizeContainer(client, MAX_HEIGHT)
  }
}

const extractTags = async (client) => {
  let currentLocation = (await client.context().catch(e => { throw new Error(e) })).location
  currentLocation = currentLocation.replace('_sidebar', '.tags')
  let tags = await client.get(currentLocation).catch(e => { throw new Error(e) })
  if (Object.keys(tags['errors']).length > 0) {
    let errorString = Object.keys(tags['errors']).reduce(key => `${key}: ${tags['errors'][key]}`, '')
    throw new Error(`API returned errors: ${errorString}`)
  } else {
    return tags[currentLocation]
  }
}

const handleError = (error) => {
  console.warn('An error happened: ', error.message)
}

export default tinApp
