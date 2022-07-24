import React from "react";
import ChatBox from "client/game/gui/jsx/ChatBox";
import PlayerList from "client/game/gui/jsx/PlayerList";

function GameOverlay() {

    return <>
        <ChatBox />
        <PlayerList />
    </>;
}

export default GameOverlay;