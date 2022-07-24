import React, { useCallback, useEffect, useRef, useState } from "react";
import "client/game/gui/jsx/ChatBox.scss";

function ChatBox() {

    const [focused, setFocused] = useState(true);
    const [messages, setMessages] = useState<{ text: string, color?: string }[]>([]);
    const [text, setText] = useState("");
    const messageListRef = useRef<HTMLDivElement>(null);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const restartAnimation = useCallback(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.style.animation = "none";
            setTimeout(() => {
                chatBoxRef.current && (chatBoxRef.current.style.animation = "");
            }, 1);
        }
    }, [chatBoxRef]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
        restartAnimation();
    }, [messages]);

    useEffect(() => {
        const pointerLockChangeListener = () => {
            setFocused(!document.pointerLockElement);
        };
        const keyPressListener = (e: KeyboardEvent) => {
            if (e.code === "KeyT") {
                document.exitPointerLock();
            }
        };
        document.addEventListener("pointerlockchange", pointerLockChangeListener);
        document.addEventListener("keypress", keyPressListener);
        return () => {
            document.removeEventListener("pointerlockchange", pointerLockChangeListener);
            document.removeEventListener("keypress", keyPressListener);
        };
    }, []);

    useEffect(() => {
        if (focused) {
            inputRef.current?.focus();
        }
    }, [focused]);

    useEffect(() => {
        const listener = (message: { text: string, color?: string }) => {
            setMessages(messages.concat(message));
        };
        game.client.socket?.on("chatMessage", listener);
        return () => {
            game.client.socket?.removeListener("chatMessage", listener);
        };
    }, [messages]);

    const sendMessage = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (text === "") return;
            game.client.socket?.emit("chatMessage", { text });
            setText("");
            setFocused(false);
            GL.canvas.requestPointerLock();
        }
    }, [text]);

    return <div className={focused ? "chatBox" : "chatBox unfocused"} ref={chatBoxRef} >
        <div className={focused ? "messages focused" : "messages"} ref={messageListRef}>
            <ul>
                {messages.map((message, index) =>
                    <li key={index} style={{ color: message.color ?? "white" }}>{message.text}</li>)}
            </ul>
        </div>

        {
            focused && <input type="text" ref={inputRef} spellCheck={false} max={100} value={text}
                              onChange={(e) => setText(e.target.value)}
                              onKeyPress={sendMessage} />
        }

    </div>;
}

export default ChatBox;