import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Message from "./Message";


function ChatBox() {

    const navigate = useNavigate();

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageMode, setImageMode] = useState(false);
    const [listening, setListening] = useState(false);

    const bottomRef = useRef(null);
    const recognitionRef = useRef(null);


    useEffect(() => {
        loadHistory();
    }, []);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);


    const loadHistory = async () => {
        try {
            const response = await API.get("/chat");
            setMessages(response.data.messages || []);
        } catch (error) {
            console.log("LOAD HISTORY ERROR:", error.response?.data || error.message);
        }
    };


    const clearChat = async () => {

        if (!window.confirm("Delete this entire conversation?")) return;

        try {
            await API.delete("/chat");
            setMessages([]);
        } catch (error) {
            console.log("CLEAR CHAT ERROR:", error.response?.data || error.message);
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };


    // Voice input (Chrome / Edge)
    const toggleMic = () => {

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
            return;
        }

        if (listening) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setInput((prev) => (prev + " " + text).trim());
        };

        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setListening(true);
    };


    const sendMessage = async () => {

        if (!input.trim() || loading) return;

        const wantsImage = imageMode || /^\/imagine\s+/i.test(input.trim());
        const text = input.trim().replace(/^\/imagine\s+/i, "");

        if (!text) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: text, type: wantsImage ? "image" : "text" }
        ]);

        setInput("");
        setLoading(true);

        try {

            if (wantsImage) {

                const response = await API.post("/chat/image", { prompt: text });

                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: response.data.imageUrl, type: "image" }
                ]);

            } else {

                const response = await API.post("/chat", { message: text });

                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: response.data.response, type: "text" }
                ]);
            }

        } catch (error) {

            console.log("CHAT ERROR:", error.response?.data || error.message);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    type: "text",
                    content: `⚠️ Error: ${error.response?.data?.message || error.message}`
                }
            ]);

        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="chat-container">

            <div className="chat-header">

                <h1>✨ NexaChat</h1>

                <p>Powered by Groq AI</p>

                <div className="header-actions">
                    <button onClick={clearChat} disabled={!messages.length}>
                        Clear chat
                    </button>
                    <button onClick={logout}>
                        Logout
                    </button>
                </div>

            </div>


            <div className="chat-window">

                {messages.length === 0 && !loading && (
                    <div className="empty-state">
                        👋 Hi! Ask me anything, or tap 🎨 to create an image.
                    </div>
                )}

                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}

                {loading && (
                    <div className="typing">
                        {imageMode ? "Creating your image..." : "NexaChat is thinking..."}
                    </div>
                )}

                <div ref={bottomRef}></div>

            </div>


            <div className="input-area">

                <button
                    className={`icon-btn ${imageMode ? "active" : ""}`}
                    onClick={() => setImageMode((v) => !v)}
                    title="Image mode: your next message becomes an image"
                >
                    🎨
                </button>

                <button
                    className={`icon-btn ${listening ? "active" : ""}`}
                    onClick={toggleMic}
                    title="Speak your message"
                >
                    🎤
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) sendMessage();
                    }}
                    placeholder={
                        imageMode
                            ? "Describe the image you want..."
                            : listening
                                ? "Listening..."
                                : "Ask anything... (or type /imagine a cat)"
                    }
                />

                <button className="send-btn" onClick={sendMessage} disabled={loading}>
                    {loading ? "..." : imageMode ? "Create" : "Send"}
                </button>

            </div>

        </div>

    );
}


export default ChatBox;
