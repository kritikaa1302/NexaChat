import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


// Turn markdown into clean text for the speech engine
function toSpeechText(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, " Code block skipped. ")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#*_>|~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function GeneratedImage({ url }) {

    const [status, setStatus] = useState("loading");

    return (

        <div className="img-wrap">

            {status === "loading" && (
                <div className="img-loading">
                    🎨 Painting your image... this can take 10-30 seconds
                </div>
            )}

            {status === "error" ? (
                <div className="img-error">
                    Couldn't load the image. The free image service allows
                    roughly one image every 15 seconds, so wait a moment and try again.
                </div>
            ) : (
                <img
                    src={url}
                    alt="AI generated"
                    onLoad={() => setStatus("done")}
                    onError={() => setStatus("error")}
                    style={{ display: status === "done" ? "block" : "none" }}
                />
            )}

            {status === "done" && (
                <a className="pill-btn" href={url} target="_blank" rel="noreferrer">
                    Open full size
                </a>
            )}

        </div>

    );
}


function Message({ message }) {

    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const isUser = message.role === "user";
    const isImage = message.type === "image";

    // Stop speaking if this message disappears
    useEffect(() => {
        return () => {
            if (speaking) window.speechSynthesis?.cancel();
        };
    }, [speaking]);

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.log("COPY ERROR:", error);
        }
    };

    const toggleSpeech = () => {

        if (!window.speechSynthesis) {
            alert("Your browser doesn't support voice playback.");
            return;
        }

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(toSpeechText(message.content));
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
    };

    return (

        <div className={isUser ? "user-message" : "ai-message"}>

            <div className="message-top">

                <h4>{isUser ? "You" : "NexaChat"}</h4>

                {!isUser && !isImage && (
                    <div className="message-actions">
                        <button className="pill-btn" onClick={toggleSpeech}>
                            {speaking ? "⏹ Stop" : "🔊 Listen"}
                        </button>
                        <button className="pill-btn" onClick={copyText}>
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}

            </div>

            <div className="message-content">

                {isImage && !isUser ? (
                    <GeneratedImage url={message.content} />
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {isImage ? `🎨 ${message.content}` : message.content}
                    </ReactMarkdown>
                )}

            </div>

        </div>

    );
}


export default Message;
