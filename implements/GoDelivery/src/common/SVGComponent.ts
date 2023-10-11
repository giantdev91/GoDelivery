const firsthtml = '<html><head><style>html, body { margin:0; padding:0; overflow:hidden; background-color: transparent; } svg { position:fixed; top:0; left:0; height:100%; width:100%; background-color: #00000000; }</style></head><body>'
const lasthtml = '</body></html>'
const redSpiningSVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="256px" height="256px"
    style="background-color: #00000000; border-radius: 100px;"
    viewBox="0 0 128 128" xml:space="preserve">
    <circle cx="64.13" cy="64.13" r="27.63" fill="#f1592b"/>
    <path d="M64.13 18.5A45.63 45.63 0 1 1 18.5 64.13 45.63 45.63 0 0 1 64.13 18.5zm0 7.85a37.78 37.78 0 1 1-37.78 37.78 37.78 37.78 0 0 1 37.78-37.78z" fill-rule="evenodd" fill="#f1592b"/>
    <g>
        <path d="M95.25 17.4a56.26 56.26 0 0 0-76.8 13.23L12.1 26.2a64 64 0 0 1 87.6-15.17z" fill="#f1592b"/>
        <path d="M95.25 17.4a56.26 56.26 0 0 0-76.8 13.23L12.1 26.2a64 64 0 0 1 87.6-15.17z" fill="#f1592b" transform="rotate(120 64 64)"/>
        <path d="M95.25 17.4a56.26 56.26 0 0 0-76.8 13.23L12.1 26.2a64 64 0 0 1 87.6-15.17z" fill="#f1592b" transform="rotate(240 64 64)"/>
        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="120 64 64" dur="1080ms" repeatCount="indefinite"></animateTransform>
    </g>
</svg>`;

const RedSpining = `${firsthtml}${redSpiningSVG}${lasthtml}`;

export {
    RedSpining,
}