#! /usr/bin/env node
const yargs = require("yargs");
const axios = require("axios");
const fetch = require("node-fetch");

const args = yargs(process.argv.slice(2)).argv;

console.log(typeof args.t);

// get track data
const track = args.t || "i need a dollar";
const artist = args.a || "aloe blacc";

const url = `https://api.deezer.com/search?q=artist:"${artist}" track:"${track}"`;

const getSong = async (track, artist) => {
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
};

getSong(track, artist);
