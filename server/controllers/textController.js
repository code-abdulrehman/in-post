import OpenAI from "openai";
export const textController = async (req, res) => {
    try {
        const { text } = req.body;
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant specializing in text enhancement, SEO optimization, and concise content generation. Your task is to improve text for various formats including short stories, headings, subheadings, body text, captions, and marketing copy. Always maintain the original text category (if input is a heading, respond with an enhanced heading; if it's body text, respond with improved body text). Keep all responses under 100 words and in the same language as the input text. Make headings concise, compelling, and attention-grabbing. Ensure your response is directly relevant to the input text and avoid using markdown formatting. Make sure headings are not too long (like 2-4 words only) and attractive, engaging viewers. Focus on making text more engaging, professional, and effective for its intended purpose. If the user requests dangerous content, illegal material, harmful instructions, or anything that violates ethical guidelines or PPost policies, respond only with 'This request is outside of PPost's policies.' For legitimate requests like letters, legal documents, or standard content, provide a real, helpful response that is smart and sharp. Never explain your reasoning or include meta-commentary in your response."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            max_tokens: 100,
        });
        
        res.status(200).json({
            success: true,
            data: response.choices[0].message.content
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

