/**
 *  Example app
 **/

import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, render } from '../../javascripts/lib/helpers'
import getDefaultTemplate from '../../templates/default'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class App {
  constructor (client, appData) {
    this._client = client
    this._appData = appData

    this.states = {}

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    const currentUser = (await this._client.get('currentUser')).currentUser
    this.states.currentUserName = currentUser.name

    I18n.loadTranslations(currentUser.locale)

    /*const organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))
*/
    this.extractTags().then(tags => {
      if (tags && tags.length) {
        this.states.tags = tags
      } else {
        this.states.tags = []
      }
      render('.loader', getDefaultTemplate(this.states))

      return resizeContainer(this._client, MAX_HEIGHT)
    }).catch(this._handleError.bind(this))

    /*if (organizations) {
      this.states.organizations = organizations.organizations
*/
      // render application markup
    //}
  }

  extractTags ()  {
    return new Promise((resolve, reject) => {
      this._client.context().then(context => {
        let locationEndpoint = undefined
        if (!('location' in context)) {
          reject('API returned context without location')
        }
        if ([ 'organization', 'ticket', 'user' ].some(knownLocation => 
          context.location === `${knownLocation}_sidebar`
        )) {
          let locationEndpoint = context.location.replace('_sidebar', '')
          this._client.get(`${locationEndpoint}.tags`).then(tags => {
            if (Object.keys(tags['errors']).length > 0) {
              let errorString = Object.keys(tags['errors']).reduce(key => `${key}: ${tags['errors'][key]}`, '')
              reject(`API returned errors: ${errorString}`)
            }
            resolve(tags[`${locationEndpoint}.tags`])
          }).catch(error => reject(error.message))
        } else {
          reject(`Unknown location: ${context.location}`)
        }
        /*
        switch (response.location) {
          case 'organization_sidebar':
            locationEndpoint = 'organization'
            break
          case 'ticket_sidebar':
            locationEndpoint = 'ticket'
            break
          case 'user_sidebar':
            locationEndpoint = 'user'
          default:
            reject(`Unknown location: ${response.location}`)
        }
        */
      }).catch(error => reject(error))
    })
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
