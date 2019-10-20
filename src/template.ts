export default ({ body, title, serialized }:{[propertyname:string]:string}) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width">
          <link rel="stylesheet" href="/dist/index.css" />
        </head>
      <body>
        <div id="main">${body}</div>
        <script src="/node_modules/react/umd/react.development.js"></script>
        <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
        <script>
          window.__SERIALIZED_DATA = ${serialized};
        </script>
        <script src="/dist/index.js"></script>
      
      </body>
      </html>
    `;
  };