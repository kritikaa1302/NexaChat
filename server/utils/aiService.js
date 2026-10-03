const Groq = require("groq-sdk");


const groq = new Groq({

    apiKey: process.env.GROQ_API_KEY

});



const generateAIResponse = async(messages)=>{


    try{


        const completion =
        await groq.chat.completions.create({

            messages: [

               {
    role:"system",

    content:`

You are a professional AI assistant.

Follow these response rules:

1. Always structure answers clearly.

2. Use headings with markdown when explaining concepts.

3. Use bullet points and numbered lists instead of large paragraphs.

4. Explain difficult concepts step-by-step.

5. When teaching programming or technical topics:
   - Start with a short definition.
   - Explain the core concept.
   - Give examples.
   - Mention real-world usage.
   - End with a short summary.

6. Keep answers easy to understand but technically accurate.

7. Use code blocks when providing code.

8. Avoid unnecessary repetition.

9. If comparing things, use tables whenever useful.

10. Make responses look like professional documentation.

`
},


                ...messages

            ],


            model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",


            temperature:0.7

        });



        return completion
        .choices[0]
        .message
        .content;



    }
   catch(error){

console.log(
" GROQ ERROR:",
error
);

throw error;

}


};



module.exports = generateAIResponse;