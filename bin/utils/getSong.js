const axios = require("axios");

module.exports = async (track, musician, album) => {
  const url = `https://api.deezer.com/search?q=track:"${track}" artist:"${
    musician ?? ""
  }" album:"${album ?? ""}"`;

  const songsList = await axios.get(url);

  if (!songsList.data.data[0]) {
    return;
  }

  const song = await axios.get(
    `https://api.deezer.com/track/${songsList.data.data[0].id}`
  );

  return song.data.share;
};
