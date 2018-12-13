const {getInitialProps} = require('./common');
const generateHtml = require('@brillout/index-html');

module.exports = {renderPageHtml};

async function renderPageHtml({renderToHtml, pageConfig, url, router, context}) {
    context = {
      isNodejs: true,
      ...context,
    };

    let html;
    try {
        const initialProps = await getInitialProps({pageConfig, url, router, context});
        html = await renderToHtml({pageConfig, initialProps});
    } catch(err) {
        if( isProduction() ) {
            throw err;
        }
        console.log();
        console.log();
        console.error(err);
        console.log();
        console.log();
        html = renderHtmlError({pageConfig, err});
    }

    return html;
}

function renderHtmlError({pageConfig, err}) {
    const errHtml = (
`<div>
    <h1>Internal Error 500</h1>
    <div>
        <pre><code>\n${err.stack}</code></pre>
    </div>
</div>
`
);

    const htmlOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push(errHtml);
    const html = generateHtml(htmlOptions);

    return html;
}

function isProduction() {
   return process.env.NODE_ENV === 'production';
}
