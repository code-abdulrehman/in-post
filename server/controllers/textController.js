import OpenAI from "openai";
export const textController = async (req, res) => {
    try {
        const { text } = req.body;
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        
        // Extract the actual text to enhance from the request
        // Remove the "Enhance this text..." prefix if it exists
        let textToEnhance = text;
        if (text.startsWith("Enhance this text to be more engaging and professional:")) {
            textToEnhance = text.replace("Enhance this text to be more engaging and professional:", "").trim();
        }
        
        // If the text is just "Text to enhance", provide a more meaningful response
        if (textToEnhance === "Text to enhance") {
            return res.status(200).json({
                success: true,
                data: "Compelling, professional content that captivates your audience."
            });
        }
        
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant specializing in text enhancement. Your task is to improve the text to make it more engaging, professional, and effective. Keep responses concise and directly enhance the provided text without explanations or commentary. Never refuse to enhance text - always provide an improved version."
                },
                {
                    role: "user",
                    content: `Enhance this text: "${textToEnhance}"`
                }
            ],
            max_tokens: 150,
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

