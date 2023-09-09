import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import playerModel from "./models/playerModel.js";
import gameModel from "./models/gameModel.js";

//* CONFIGURATIONS
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(morgan("dev"));

//* MONGOOSE CONFIGURATION
mongoose.set("strictQuery", true);

const PORT = 6001;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    setupSocketIO(server);
  })
  .catch((error) => console.log(`${error} did not connect`));

// SOCKET.IO CONFIGURATION
export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let players = [];

  io.on("connection", (socket) => {
    socket.on("join", async (data) => {
      try {
        const { playerId, isGuest } = data;
        let player = await playerModel.findOne({ playerId }).exec();

        if (!player) {
          const newPlayer = new playerModel({
            playerId: playerId,
            isGuest: isGuest,
            socketId: socket.id,
          });
          player = await newPlayer.save();
        } else {
          player.socketId = socket.id;
          player = await player.save();
        }

        matchmakePlayer(player);
      } catch (err) {
        console.error(err);
      }
    });

    const matchmakePlayer = async (player) => {
      if (players.find((p) => p._id === player._id)) {
        return;
      } else {
        players.push(player);
      }

      if (players.length >= 2) {
        // Find an existing game with these players
        const existingGame = await gameModel
          .findOne({
            players: { $all: players.map((p) => p._id) },
          })
          .populate("players")
          .exec();

        if (existingGame) {
          existingGame.players.forEach((p, index) => {
            io.to(p.socketId).emit("game", {
              roomId: existingGame.roomId,
              color:
                index === 0
                  ? existingGame.player1Color
                  : existingGame.player2Color,
            });
          });
        } else {
          const roomId = generateUniqueRoomId();

          const newGame = new gameModel({
            roomId: roomId,
            players: players.map((p) => p._id),
            player1Color: "w",
            player2Color: "b",
          });

          await newGame.save();
          socket.join(roomId);

          const game = await gameModel
            .findOne({
              roomId: roomId,
            })
            .populate("players")
            .exec();

          game.players.forEach((p, index) => {
            io.to(p.socketId).emit("game", {
              roomId: roomId,
              color: index === 0 ? game.player1Color : game.player2Color,
            });
          });
        }

        // Clear the players array
        players.length = 0;
      }
    };
  });
}

function generateUniqueRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
  res.send("Hello world!");
});
