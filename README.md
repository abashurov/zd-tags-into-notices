# zd-tags-into-notices

Zendesk plugin that extracts tags and shows corresponding warnings.
Inspired by [zd-tag-warnings](https://github.com/TWHarr/zd-tag-warnings). 

## How to configure it?

This plugin takes JSON configuration.  
Why JSON? It was the most simple way to overcome App parameters limited by design. It's also a readable-enough format, sane (compared to YAML) and can be easily minified.

There are three parameters (at this moment) that can be configured, and only one of them is actually necessary:

1. Tags. It is an array of JSON objects, with the following parameters:

    * `name`: Name of the tag
    * `style`: Name of the style that should be used (it no style matches, default will be used)
    * `desc`: The line that will be displayed to agents in the sidebar
    * `link`: Optional link to the processes' handling documentation

2. Styles. It is an array of JSON objects, with the following parameters:

    * `name`: Name of the style that will be matched against `style` of tag
    * `style`: CSS that should be applied to the element

3. Default. It is an array of JSON objects, with the following parameters:

    * `desc`: Default line to be displayed when there are no other tag triggers
    * `style`: Default style to be applied if there are no other styles
