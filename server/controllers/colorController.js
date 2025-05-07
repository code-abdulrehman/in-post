import OpenAI from "openai";
export const colorController = async (req, res) => {
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
                    content: "You are a color palette specialist AI assistant. Your task is to generate harmonious and visually appealing color palettes based on user requests. Create palettes with 4-6 complementary colors, providing the hex codes for each color. Focus exclusively on color combinations that work well together for design projects. Consider color theory principles like complementary, analogous, monochromatic, or triadic relationships when creating palettes. If users request specific themes (e.g., 'ocean', 'autumn', 'corporate'), provide appropriate color schemes that evoke those themes. For specific brand-related requests, suggest professional color combinations that align with industry standards. Always format responses as a simple list of hex codes without explanations. If a request is unclear or outside the scope of color palette creation, ask for clarification about the desired color theme or mood."
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

