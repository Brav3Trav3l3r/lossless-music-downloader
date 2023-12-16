#! /usr/bin/env node
const yargs = require('yargs');
const ora = require('ora');
const getSong = require('./utils/getSong');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const waitUntilDownload = require('./utils/waitUntilDownload');

const args = yargs(process.argv.slice(2))
  .usage('Usage: music -t [string] -a [string] -m [string] -o [string]')
  .options({
    a: {
      alias: 'album',
      type: 'string',
    },
    t: {
      alias: 'track',
      required: true,
      type: 'string',
    },
    m: {
      alias: 'musician',
      type: 'string',
    },
    o: {
      alias: 'output',
      required: true,
      describe: 'C:\\Users\\Username\\Music',
      type: 'string',
    },
  }).argv;

const downloadTrack = async () => {
  const spinner = ora('Finding song...').start();
  const songUrl = await getSong(args.t, args.m, args.a);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  if (!songUrl) {
    spinner.fail('Song not found. Are you sure inputs are correct?');
    return browser.close();
  }

  spinner.text = 'Song found';
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 2000);
  });

  spinner.text = 'Preparing to download';
  await page.goto('https://doubledouble.top/');
  await page.type('#dl-input', songUrl);
  await page.click('#dl-button');

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: args.o,
  });

  try {
    spinner.text = 'Downloading...';
    await waitUntilDownload(page);
    spinner.succeed('Downloaded successfully');
  } catch {
    spinner.fail('Download failed');
  }

  browser.close();
};

downloadTrack();
