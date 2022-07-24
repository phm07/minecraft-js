import React, { useEffect, useMemo, useState } from "react";
import "client/game/gui/jsx/PlayerList.scss";
import DefaultSkin from "client/assets/steve.png";
import GameScene from "client/scene/GameScene";
import ImageUtils from "client/util/ImageUtils";

type Player = { id: string, name: string, skin?: string };

function Avatar(props: { skin?: string, defaultAvatar?: string }) {

    const [imgSrc, setImgSrc] = useState<string | null>(null);

    if (imgSrc === null) {
        if (props.skin) {
            void ImageUtils.fromSource(props.skin).then((imageData) => {
                setImgSrc(new ImageUtils(imageData, 8, 8, 8, 8).toBase64());
            });
        } else {
            setImgSrc(props.defaultAvatar ?? null);
        }
    }

    return <img src={imgSrc ?? "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt="Avatar" className="avatar" draggable={false} />;
}

function PlayerList() {

    const [visible, setVisible] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const defaultAvatar = useMemo(() => new ImageUtils(DefaultSkin, 8, 8, 8, 8).toBase64(), []);

    useEffect(() => {

        if (!players.length) {
            players.push({ id: game.client.playerId ?? "", name: game.client.playerName ?? "", skin: game.client.playerSkin ?? undefined });

            (game.scene as GameScene).humanFactory.humans.forEach((human) => {
                players.push({ id: human.id, name: human.name, skin: human.skin ?? undefined });
            });

            setPlayers(players);
        }

        const playerAddListener = (packet: { id: string, name: string, skin?: string }) => {
            players.push(packet);
            setPlayers(players);
        };

        const playerRemoveListener = (packet: { id: string }) => {
            setPlayers(players.filter((player) => player.id !== packet.id));
        };

        game.client.socket?.on("playerAdd", playerAddListener);
        game.client.socket?.on("playerRemove", playerRemoveListener);
        return () => {
            game.client.socket?.removeListener("playerAdd", playerAddListener);
            game.client.socket?.removeListener("playerRemove", playerRemoveListener);
        };
    }, [players]);

    useEffect(() => {

        const keyDownListener = (e: KeyboardEvent) => {
            if (e.code === "Tab") {
                e.preventDefault();
                setVisible(true);
            }
        };

        const keyUpListener = (e: KeyboardEvent) => {
            if (e.code === "Tab") {
                setVisible(false);
            }
        };

        window.addEventListener("keydown", keyDownListener);
        window.addEventListener("keyup", keyUpListener);
        return () => {
            window.removeEventListener("keydown", keyDownListener);
            window.removeEventListener("keyup", keyUpListener);
        };
    }, []);

    return <div className={visible ? "playerList" : "playerList invisible"}>
        <ul>
            { players.sort((a, b) => a.name.localeCompare(b.name)).map((player, index) => <li key={index}>
                <Avatar skin={player.skin} defaultAvatar={defaultAvatar} />
                { player.name }
            </li>) }
        </ul>
    </div>;
}

export default PlayerList;