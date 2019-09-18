import * as Mustache from 'mustache'

import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, render } from '../../javascripts/lib/helpers'
import { preloadTemplate } from '../../templates/preload'
import {
    defaultTemplate,
    errorTemplate,
} from '../../templates/default'
import {
    emptyWarning,
    errorDetails,
    linkedWarning,
    plainWarning,
    ruler,
} from '../../templates/partials'
import { extractTags } from './tags'
const MAX_HEIGHT = 1000

const tinApp = async (client, initial = false) => {
    if (initial) {
        await init(client)
            .catch(e => handleError(e, 'Could not initialize the application'))
    }
    await appRender(client)
}

const init = async (client) => {
    const currentUser = (await client.get('currentUser')).currentUser
    I18n.loadTranslations(currentUser.locale)
    render('.loader', preloadTemplate)
    await appRender(client)
}

const appRender = async (client) => {
    const tags = await extractTags(client)
        .catch(e => handleError(e, I18n.t('runtime.errors.tagsLoading')))
    const settings = await client
        .metadata()
        .catch(e => handleError(e, I18n.t('runtime.errors.settingsLoading')))
    const view = await buildView(tags, settings.settings)
        .catch(e => handleError(e, I18n.t('runtime.errors.viewLoading')))
    
    if (view) {
        render('.app', view)
    }
    return resizeContainer(client, MAX_HEIGHT)
}

const buildView = async (tags, settings) => {
    let config = {}
    let content = ''
    try {
        config = {
            tags: JSON.parse(settings.tags),
            styles: JSON.parse(settings.styles),
            defaults: JSON.parse(settings.defaults),
        }
    } catch (e) {
        handleError(e, I18n.t('runtime.errors.configParsing'))
        console.log(e)
        return
    }
    console.log(config)

    const objectTags = config.tags.filter(tag => tags.includes(tag.name))
    if (!objectTags.length) {
        content = Mustache.render(emptyWarning, {
            description: config.defaults.desc || 'Coast is clear',
        })
        console.log(content)
    } else {
        content = objectTags.map(tag => {
            let style = config.styles.find(style => style.name === tag.style)
            style = style ? style.style : (config.defaults.style || '')
            if (tag.link) {
                return Mustache.render(linkedWarning, {
                    style: style,
                    description: tag.desc,
                    link: tag.link,
                    linkText: I18n.t('runtime.doclink'),
                })
            }
            return Mustache.render(plainWarning, {
                style: style,
                description: tag.desc,
            })
        }).join(ruler)
        console.log(content)
    }

    return Mustache.render(defaultTemplate, {
        content
    })
}

const handleError = (error, errorDescription) => {
    console.log(error)
    render('.app', Mustache.render(errorTemplate, {
        errorDescription,
        errorDetails: error.message,
    }, {
        errorDetails,
    }))
}

export default tinApp
