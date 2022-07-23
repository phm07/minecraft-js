import React, { useCallback, useEffect, useState } from "react";
import "client/game/gui/jsx/LoginBox.scss";
import Logo from "client/assets/logo.png";
import DefaultSkin from "client/assets/steve.png";
import HomeScene from "client/scene/HomeScene";
import ImageUtils from "client/util/ImageUtils";

function LoginBox() {

    const [logo, setLogo] = useState<string>("");
    const [skin, setSkin] = useState<string>("");
    const [connecting, setConnecting] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const startGame = useCallback(async () => {
        setConnecting(true);
        try {
            await (game.scene as HomeScene).startGame(name);
        } catch (err) {
            if (typeof err === "string") {
                setError(err);
            }
        }
        setConnecting(false);
    }, [name]);

    useEffect(() => {
        setSkin(new ImageUtils(DefaultSkin).toBase64());
        setLogo(new ImageUtils(Logo).toBase64());
    }, []);

    if (!logo) return <></>;

    return (
        <div>
            <img className="logo" src={logo} alt="Logo" draggable={false} />
            <div className="loginBox">

                <h1>Login</h1>

                <p>Name:</p>
                <input type="text" spellCheck="false" onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        void startGame();
                    }
                }} value={name} onChange={(e) => setName(e.target.value)} disabled={connecting} />

                <p>Skin:</p>
                <img className="skin" src={skin} alt="Skin" draggable={false} />

                {
                    error ? <div className="error">Error: {error}</div> : <></>
                }
                <button onClick={() => void startGame()} disabled={connecting}>Play</button>
            </div>
        </div>
    );
}

export default LoginBox;