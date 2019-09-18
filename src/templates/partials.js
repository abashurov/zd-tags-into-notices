const emptyWarning = `
<li>
    <p class="default_text">{{description}}</p>
</li>
`

const linkedWarning = `
<li>
    <p style="{{style}}">{{description}}</p>
    <a target="_blank" href="{{link}}">{{linkText}}</a>
</li>
`

const plainWarning = `
<li>
    <p style="{{style}}">{{description}}</p>
</li>
`

const errorDetails = `
<p class="default_text">{{errorDescription}}</p>
<pre class="error_wrapper">
    <code>{{errorDetails}}</code>
</pre>
`

const ruler = `
<li>
    <hr class="ruler" />
</li>
`

export { 
    emptyWarning,
    errorDetails,
    linkedWarning,
    plainWarning,
    ruler,
}