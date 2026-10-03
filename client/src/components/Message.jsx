import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function Message({ message }) {

    const [copied, setCopied] = useState(false);

    const isUser = message.role === "user";

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.log("COPY ERROR:", error);
        }
    };

    return (

        <div className={isUser ? "user-message" : "ai-message"}>

            <div className="message-top">

                <h4>{isUser ? "You" : "AI Assistant"}</h4>

                {!isUser && (
                    <button className="copy-btn" onClick={copyText}>
                        {copied ? "Copied!" : "Copy"}
                    </button>
                )}

            </div>

            <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>
            </div>

        </div>

    );
}


export default Message;
