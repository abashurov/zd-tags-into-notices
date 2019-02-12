import { escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'

const populateConfig = (settings) => {
  let config = { valid: true }
  try {
    config.tags = JSON.parse(settings.tags)
    config.styles = JSON.parse(settings.styles)
  } catch (error) {
    config.valid = false
    config.message = error
  }
  return config
}

const generateView = (tags, config) => {
  let f_tags = config.tags.filter(tag => tags.includes(tag.name))
  if (f_tags.length === 0) {
    return `<li>
      <p style="line-height:2.5rem;font-size:2rem;">Coast is clear</p>
      </li>`
  }
  return f_tags.map(tag => {
    let style = config.styles.find(style => style.name === tag.style) || ''
    if (tag.link) {
      return `<li>
        <p style="${escape(style.style)}">${escape(tag.desc)}</p>
        <a target="_blank" href="${escape(tag.link)}">Documentation link</a>
      </li>`
    }
    return `<li><p style="${escape(style)}">${escape(tag.desc)}</p></li>`
  })
}

export default function (args) {
  let config = populateConfig(args.settings)
  if (!config.valid) {
    return `<div class="example-app">
        <p style="line-height:2.5rem;font-site:2rem;">Failed to parse current configuration: </p>
        <pre><code>${escape(config.message)}</code></pre>
      </div>`
  } else {
    return `<div class="example-app">
        <div>
          <ul>${generateView(args.tags, config)}</ul>
        </div>
      </div>`
  }
}
