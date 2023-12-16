// Refer: "https://stackoverflow.com/questions/53471235/how-to-wait-for-all-downloads-to-complete-with-puppeteer"

async function waitUntilDownload(page, fileName = '') {
  return new Promise((resolve, reject) => {
    page._client().on('Page.downloadProgress', (e) => {
      if (e.state === 'completed') {
        resolve(fileName);
      } else if (e.state === 'canceled') {
        reject(new Error('Download failed'));
      }
    });
  });
}

module.exports = waitUntilDownload;
