import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import "client/game/gui/jsx/LoginBox.scss";
import Logo from "client/assets/logo.png";
import DefaultSkin from "client/assets/steve.png";
import HomeScene from "client/scene/HomeScene";
import ImageUtils from "client/util/ImageUtils";

function LoginBox() {

    const [logo, setLogo] = useState<string>("");
    const [skin, setSkin] = useState<string | null>(localStorage.getItem("skin") as string);
    const [defaultSkin, setDefaultSkin] = useState<string>("");
    const [connecting, setConnecting] = useState(false);
    const [name, setName] = useState(localStorage.getItem("name") as string);
    const [error, setError] = useState<string | null>(null);

    const fileUpload = useRef<HTMLInputElement>(null);

    const startGame = useCallback(async () => {
        setConnecting(true);
        try {
            if (skin) {
                localStorage.setItem("skin", skin);
            } else {
                localStorage.removeItem("skin");
            }
            localStorage.setItem("name", name);
            await (game.scene as HomeScene).startGame(name, skin ?? undefined);
        } catch (err) {
            if (typeof err === "string") {
                setError(err);
            }
        }
        setConnecting(false);
    }, [name, skin]);

    useEffect(() => {
        setDefaultSkin(new ImageUtils(DefaultSkin).toBase64());
        setLogo(new ImageUtils(Logo).toBase64());
    }, []);

    if (!logo) return <></>;

    const onSkinSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();

        if (!e.target.files) return;
        if (e.target.files[0].type !== "image/png") {
            setError("Please select a png file");
            return;
        }

        const base64 = await new Promise<string>((resolve) => {
            if (!e.target.files) return;
            fileReader.addEventListener("loadend", (progressEvent) => {
                if (!progressEvent.target) return;
                resolve(progressEvent.target.result as string);
            });
            fileReader.readAsDataURL(e.target.files[0]);
        });

        const image = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.addEventListener("load", () => {
                resolve(img);
            });
            img.src = base64;
        });

        if (image.naturalWidth !== 64 || image.naturalHeight !== 64) {
            setError("Image has to be 64x64");
            return;
        }

        setSkin(base64);
    };

    return (
        <div>
            <input type="file" hidden={true} ref={fileUpload} accept="image/png" onChange={(e) => void onSkinSelect(e)} />

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
                <img className="skin" src={skin ?? defaultSkin} alt="Skin" draggable={false} />
                <button onClick={() => fileUpload.current?.click()}>Upload skin...</button>
                <button style={{ marginLeft: "0.5em" }} onClick={() => setSkin(null)}>Remove</button>
                {
                    error ? <div className="error">Error: {error}</div> : <></>
                }
                <button className="playButton" onClick={() => void startGame()} disabled={connecting}>Play</button>
            </div>
        </div>
    );
}

export default LoginBox;