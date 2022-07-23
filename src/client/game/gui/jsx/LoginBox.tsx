import React, { useCallback, useEffect, useState } from "react";
import "src/client/game/gui/jsx/LoginBox.scss";
import Logo from "src/client/assets/logo.png";
import HomeScene from "src/client/scene/HomeScene";
import ImageUtils from "src/common/util/ImageUtils";

function LoginBox() {

    const [logo, setLogo] = useState("");
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
        console.log(new ImageUtils(Logo).toBase64());
        setLogo(new ImageUtils(Logo).toBase64());
    }, []);

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
                {
                    error ? <div className="error">Error: {error}</div> : <></>
                }
                <button onClick={() => void startGame()} disabled={connecting}>Play</button>
            </div>
        </div>
    );
}

export default LoginBox;