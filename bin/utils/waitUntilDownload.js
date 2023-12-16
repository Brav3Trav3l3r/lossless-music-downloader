// Refer: "https://stackoverflow.com/questions/53471235/how-to-wait-for-all-downloads-to-complete-with-puppeteer"
async function waitUntilDownload(page, fileName = "") {
  console.log("started");
  return new Promise((resolve, reject) => {
    page._client().on("Page.downloadProgress", (e) => {
      if (e.state === "completed") {
        console.log("completed");
        resolve(fileName);
      } else if (e.state === "canceled") {
        console.log("canceled");
        reject();
      }
    });
  });
}

module.exports = waitUntilDownload;
