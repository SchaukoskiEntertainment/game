import { pusher } from "../../../lib"

export default async function handler(req, res) {
  const { socket_id, channel_name, username } = req.body;

  //const randomString = Math.random().toString(36).slice(2);

  // var xPlayer = Math.floor(Math.random() * 621);
  // var yPlayer = Math.floor(Math.random() * 341);

  var xPlayer = 0
  var yPlayer = 0
  var tileCoord = {x: 0, y: 0}

  const presenceData = {
    user_id: socket_id,
    user_info: {
      player: {
        id: socket_id,
        x: xPlayer,
        y: yPlayer,
        tileCoord
      },
    },
  };

  try {
    var auth = pusher.authorizeChannel(socket_id, channel_name, presenceData);
    res.send(auth);
  } catch (error) {
    console.error(error);
  }
}