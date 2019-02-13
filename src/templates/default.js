import { escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'

const populateConfig = (settings) => {
  let config = { valid: true }
  try {
    config.tags = JSON.parse(settings.tags)
    config.styles = JSON.parse(settings.styles)
    config.default = JSON.parse(settings.default)
  } catch (error) {
    config.valid = false
    config.message = error
  }
  return config
}

const generateView = (tags, config) => {
  let f_tags = config.tags.filter(tag => tags.includes(tag.name))
  if (f_tags.length === 0) {
    let empty_line = config.default.desc || 'Coast is clear'
    return `<li>
      <p style="line-height:2.5rem;font-size:2rem;">${empty_line}</p>
      </li>`
  }
  return f_tags.map(tag => {
    let style = config.styles.find(style => style.name === tag.style)
    if (!style) {
      style = config.default.style || ''
    } else {
      style = style.style
    }
    if (tag.link) {
      let link = tag.link.includes('://') ? tag.link : `http://${tag.link}`
      return `<li>
        <p style="${escape(style)}">${escape(tag.desc)}</p>
        <a target="_blank" href="${escape(link)}">Documentation link</a>
      </li>`
    }
    return `<li><p style="${escape(style)}">${escape(tag.desc)}</p></li>`
  })
}

export default function (args) {
  let config = populateConfig(args.settings)
  if (!config.valid) {
    return `<div class="app">
        <p style="line-height:2.5rem;font-site:2rem;">Failed to parse current configuration: </p>
        <pre><code>${escape(config.message.toString())}</code></pre>
      </div>`
  } else {
    return `<div class="app">
        <div>
          <ul>${generateView(args.tags, config)}</ul>
        </div>
      </div>`
  }
}
