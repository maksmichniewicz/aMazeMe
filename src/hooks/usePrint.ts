export function usePrint() {
  const print = (canvases: HTMLCanvasElement[], columns: number, title: string) => {
    const dataUrls = canvases.map((c) => c.toDataURL('image/png'));

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const images = dataUrls
      .map((url) => `<img src="${url}" />`)
      .join('\n');

    const loadCheck = dataUrls.length > 1
      ? `
        var loaded = 0;
        var total = ${dataUrls.length};
        document.querySelectorAll('img').forEach(function(img) {
          if (img.complete) { loaded++; } else {
            img.onload = function() { loaded++; if (loaded >= total) { window.print(); window.close(); } };
          }
        });
        if (loaded >= total) { window.print(); window.close(); }
      `
      : `
        var img = document.querySelector('img');
        if (img.complete) { window.print(); window.close(); } else {
          img.onload = function() { window.print(); window.close(); };
        }
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: grid;
              grid-template-columns: repeat(${columns}, 1fr);
              gap: 16px;
              padding: 10px;
              justify-items: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body {
                padding: 8mm;
                gap: 10px;
                width: 100%;
                height: 100vh;
                align-content: center;
              }
              img {
                max-width: 100%;
                max-height: ${Math.floor(90 / Math.ceil(canvases.length / columns))}vh;
                object-fit: contain;
              }
            }
          </style>
        </head>
        <body>
          ${images}
          <script>${loadCheck}</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return { print };
}
