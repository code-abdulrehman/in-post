import OpenAI from "openai";
export const chatController = async (req, res) => {
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
                    content: "You are a helpful assistant specializing in generating content for InPost Designer, including enhanced text, SEO-optimized descriptions, and structured JSON data for Konva canvas elements. Keep responses under 100 words and ensure all content is appropriate for design purposes. If a request seems inappropriate or outside the scope of design assistance, reply with 'This request is outside of InPost's policies.'"
                },
                {
                    role: "user",
                    content: text
                }
            ]
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

