const axios = require('axios');
const chalk = require('chalk');
const { select, checkbox, Separator } = require('@inquirer/prompts');

module.exports = async (track, musician, album, spinner) => {
  let songId;
  const url = `https://api.deezer.com/search?q=track:"${track}" artist:"${
    musician ?? ''
  }" album:"${album ?? ''}"`;
  const resData = await axios.get(url);

  if (!resData.data.data[0]) {
    throw new Error('Song not found. Are you sure inputs are correct?');
  }

  const songsList = resData.data.data;

  const choices = songsList.map((song) => ({
    value: song.id,
    name: song.title + ' - ' + song.artist.name,
    description: `Album: ${song.album.title}`,
  }));

  spinner.stop();

  songId = await select({
    message: `${songsList.length} songs found. Select one.`,
    choices,
  });

  const resSong = await axios.get(`https://api.deezer.com/track/${songId}`);

  if (!resSong.data.share) {
    throw new Error('Cant download this song.');
  }

  return resSong.data.share;
};
