import { pusher } from "../../lib";

export default async function handler(req, res) {
  const { player } = req.body;
  const response = await pusher.trigger("presence-game", "playerEnter", {
    player
  });

  res.json({ message: "player entered" });
}