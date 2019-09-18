const defaultTemplate = `
<div class="app">
    <div>
        <ul>{{{content}}}</ul>
    </div>
</div>
`

const errorTemplate = `
<div class="app">
    <div>
        {{>errorDetails}}
    </div>
</div>
`

export { defaultTemplate, errorTemplate }
