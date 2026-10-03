import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function Message({message}){


return (

<div

className={
message.role==="user"
?
"user-message"
:
"ai-message"
}

>


<h4>

{
message.role==="user"
?
"You"
:
"AI Assistant"
}

</h4>




<div className="message-content">


<ReactMarkdown
remarkPlugins={[remarkGfm]}
>

{message.content}

</ReactMarkdown>


</div>



</div>

);


}


export default Message;