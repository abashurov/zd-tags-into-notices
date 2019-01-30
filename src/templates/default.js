import { templatingLoop as loop, escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'

function tagWrap (tag) {
  return `<li>${escape(tag)}</li>`
}

const populateConfig = (settings) => {
  let config = { valid: true }
  try {
    config.tags = JSON.parse(settings.tags)
    config.style = JSON.parse(settings.style)
  } catch (error) {
    config.valid = false
    config.message = error
  }
  return config
}

const renderTag = (tag, config) => {
  let tag_configuration = config.tags.find(t => t.tag === tag)
  if (tag_configuration) {
    let tag_style = config.style.find(s => tag_configuration.style === s.name)
    let result = `<h2 style="${escape(tag_style)}">${tag_configuration.description}</h2>`
    if (tag_configuration.link) {
      result += `<a href="${escape(tag_configuration.link)}>Documentation link</a>`
    }
    return result
  } else {
    return ''
  }
}

export default function (args) {
  let config = populateConfig(args.settings)
  if (!config.valid) {
    return `<div class="example-app>
        <h1>Failed to parse current configuration: </h1>
        <pre><code>${escape(config.message)}</code></pre>
      </div>`
  } else {
    return `<div class="example-app">
        <div>
          <h1>Hi ${escape(args.currentUserName)}, this is a sample app</h1>
          <h2>${I18n.t('default.organizations')}:</h2>
          <ul>${loop(args.tags, tagWrap)}</ul>
        </div>
      </div>`
  }
}
