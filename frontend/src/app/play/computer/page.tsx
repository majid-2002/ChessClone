"use client";
import React, { useState } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { Chess } from "chess.js";
import { Play } from "@/app/components/Play";

export default function PlayComputer() {
  const chess = new Chess();
  const [boardArray, setBoardArray] = useState(chess.board());
  const [play, setPlay] = useState<string>("w");
  const [currentTurn, setCurrentTurn] = useState<string>(chess.turn());

  // let board = [];
  // const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
  // const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // for (let i = verticalAxis.length - 1; i >= 0; i--) {
  //   for (let j = 0; j < horizontalAxis.length; j++) {
  //     board.push(horizontalAxis[j] + verticalAxis[i]);
  //   }
  // }

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-5 space-y-8 p-5">
      {/* Chessboard */}
      <Play
        boardArray={boardArray}
        chess={chess}
        setCurrentTurn={setCurrentTurn}
        setBoardArray={setBoardArray}
        playComputer={true}
        play={play}
      />

      <div className="w-full h-5/6 sm:w-1/2 md:w-1/3 bg-neutral-800  rounded-md">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">New Game</p>
          </div>
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">Games</p>
          </div>
          <div className="items-center flex justify-center flex-col p-4 text-slate-200 w-full space-y-1">
            <AiFillPlusSquare className="text-2xl" />
            <p className="text-xs">Players</p>
          </div>
        </div>
        <div className=" flex-col flex p-5 space-y-5">
          <div className="bg-lime-300/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-green-900/70 rounded-b-2xl">
            <button className="text-shadow-lg p-2 w-full">Play</button>
          </div>
          <div className="bg-neutral-600/70 flex items-center justify-center rounded-xl text-center shadow-xl sm:text-2xl text-white font-bold border border-b-8 border-neutral-800/70 rounded-b-2xl">
            <button
              className="text-shadow-lg p-2 w-full"
              onClick={() => {
                setPlay(play === "w" ? "b" : "w");
                
              }}
            >
              Change
            </button>
          </div>
          <p className="text-red-50">
            Current Turn: {currentTurn === "w" ? "White" : "Black"}
          </p>
        </div>
      </div>
    </div>
  );
}
