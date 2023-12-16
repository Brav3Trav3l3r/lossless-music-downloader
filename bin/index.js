#! /usr/bin/env node
const yargs = require("yargs");
const getSong = require("./utils/getSong");
const puppeteer = require("puppeteer");
const waitUntilDownload = require("./utils/waitUntilDownload");

const args = yargs(process.argv.slice(2)).argv;

// get track data
const downloadTrack = async () => {
  const songUrl = await getSong(args.t, args.m, args.a);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  if (!songUrl) {
    console.log("No song found. Are you sure inputs are correct?");
    return browser.close();
  }

  await page.goto("https://doubledouble.top/");
  await page.type("#dl-input", songUrl);
  await page.click("#dl-button");

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: args.o,
  });

  await waitUntilDownload(page);

  browser.close();
};

downloadTrack();
