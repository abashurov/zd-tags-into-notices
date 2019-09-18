const extractTags = async (client) => {
    let currentLocation = (
      await client
        .context()
        .catch(e => {
            throw new Error(e)
        })
    )
        .location
        .replace('_sidebar', '.tags')

    let tags = await client
        .get(currentLocation)
        .catch(e => {
            throw new Error(e)
        })

    debugger

    if (Object.keys(tags['errors']).length > 0) {
        let errorString = Object.keys(tags['errors']).reduce(key => `${key}: ${tags['errors'][key]}; `, '')
        throw new Error(`API returned errors: ${errorString}`)
    } else {
        return tags[currentLocation]
    }
}

export { extractTags }