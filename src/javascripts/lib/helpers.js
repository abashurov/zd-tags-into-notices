/**
 * Resize App container
 * @param {ZAFClient} client ZAFClient object
 * @param {Number} max max height available to resize to
 * @return {Promise} will resolved after resize
 */
export function resizeContainer (client, max = Number.POSITIVE_INFINITY) {
  const newHeight = Math.min(document.body.clientHeight, max)
  return client.invoke('resize', { height: newHeight })
}

/**
 * Helper to render a dataset using the same template function
 * @param {Array} set dataset
 * @param {Function} getTemplate function to generate template
 * @param {String} initialValue any template string prepended
 * @return {String} final template
 */
export function templatingLoop (set, getTemplate, initialValue = '') {
  return set.reduce((accumulator, item, index) => {
    return `${accumulator}${getTemplate(item, index)}`
  }, initialValue)
}

/**
 * Render template
 * @param {String} replacedNodeSelector selector of the node to be replaced
 * @param {String} htmlString new html string to be rendered
 */
export function render (replacedNodeSelector, htmlString) {
  const fragment = document.createRange().createContextualFragment(htmlString)
  const replacedNode = document.querySelector(replacedNodeSelector)

  replacedNode.parentNode.replaceChild(fragment, replacedNode)
}

/**
 * Helper to escape unsafe characters in HTML, including &, <, >, ", ', `, =
 * @param {String} str String to be escaped
 * @return {String} escaped string
 */
export function escapeSpecialChars (str) {
  if (typeof str !== 'string') throw new TypeError('escapeSpecialChars function expects input in type String')

  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return str.replace(/[&<>"'`=]/g, function (m) { return escape[m] })
}

export function populateConfig (settings) {
  let config = { valid: true }
  try {
    config.tags = JSON.parse(settings.tags)
    config.styles = JSON.parse(settings.styles)
  } catch (error) {
    config.valid = false
    config.message = error
  }
console.log(config)
  return config
}

export function renderTag (config, tag) {
  let tag_configuration = config.tags.find(t => t.tag === tag)
console.log(tag_configuration)
  if (tag_configuration) {
    let tag_style = config.styles.find(s => tag_configuration.style === s.name)
console.log(tag_style)
    let result = `<h2 style="${escape(tag_style)}">${tag_configuration.desc}</h2>`
    if (tag_configuration.link) {
      result += `<a href="${escape(tag_configuration.link)}">Documentation link</a>`
    }
    return result
  } else {
    return ''
  }
}

export function templateLoop (values, config, templateCallback) {
  return values.reduce((accumulator, item, index) => {
    return `${accumulator}${templateCallback(config, item, index)}`
  }, '')
}
