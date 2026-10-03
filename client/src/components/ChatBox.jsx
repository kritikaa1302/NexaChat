import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Message from "./Message";


function ChatBox() {

    const navigate = useNavigate();


    const [input, setInput] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);



    useEffect(() => {

        loadHistory();

    }, []);




    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior:"smooth"

        });

    }, [messages, loading]);





    const loadHistory = async()=>{


        try{


            const response =
            await API.get("/chat");


            setMessages(
                response.data.messages || []
            );


        }
        catch(error){


            console.log(
                "LOAD HISTORY ERROR:",
                error.response?.data || error.message
            );


        }


    };






    const clearChat = async()=>{

        if(!window.confirm("Delete this entire conversation?"))
            return;

        try{
            await API.delete("/chat");
            setMessages([]);
        }
        catch(error){
            console.log("CLEAR CHAT ERROR:", error.response?.data || error.message);
        }

    };


    const logout = ()=>{
        localStorage.removeItem("token");
        navigate("/");
    };


    const sendMessage = async()=>{


        if(!input.trim() || loading)
            return;



        const userMessage = {

            role:"user",

            content:input

        };



        setMessages(prev=>[

            ...prev,

            userMessage

        ]);



        const currentMessage=input;


        setInput("");

        setLoading(true);




        try{


            console.log(
                "Sending message:",
                currentMessage
            );



            const response =
            await API.post(

                "/chat",

                {
                    message:currentMessage
                }

            );



            console.log(
                "AI RESPONSE:",
                response.data
            );




            const aiMessage={

                role:"assistant",

                content:
                response.data.response

            };



            setMessages(prev=>[

                ...prev,

                aiMessage

            ]);



        }



        catch(error){


            console.log(
                "FULL CHAT ERROR:",
                error
            );



            console.log(
                "SERVER ERROR:",
                error.response?.data
            );



            setMessages(prev=>[

                ...prev,

                {

                role:"assistant",

                content:
                `⚠️ AI Error: ${
                error.response?.data?.message ||
                error.message
                }`

                }

            ]);


        }



        finally{


            setLoading(false);


        }


    };







    return (


        <div className="chat-container">



            <div className="chat-header">


                <h1>
                    🤖 AI Assistant
                </h1>


                <p>
                    Powered by Groq AI
                </p>

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



            {
                messages.length === 0 && !loading &&
                <div className="empty-state">
                    👋 Hi! Ask me anything to get started.
                </div>
            }

            {
                messages.map(
                    (message,index)=>(


                    <Message

                    key={index}

                    message={message}

                    />


                    )

                )
            }




            {
                loading &&

                <div className="typing">

                    AI is thinking...

                </div>

            }





            <div ref={bottomRef}></div>


            </div>






            <div className="input-area">


                <input


                value={input}


                onChange={
                    (e)=>
                    setInput(e.target.value)
                }



                onKeyDown={
                    (e)=>{

                    if(e.key==="Enter" && !e.shiftKey)
                    sendMessage();

                    }

                }



                placeholder="Ask anything..."

                />





                <button

                onClick={sendMessage}

                disabled={loading}

                >

                {
                    loading
                    ?
                    "..."
                    :
                    "Send"
                }


                </button>


            </div>




        </div>


    );


}


export default ChatBox;