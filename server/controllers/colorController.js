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
                    content: "You are a professional color palette specialist AI assistant. Your task is to create cohesive, visually appealing color palettes based on user descriptions or themes. Follow these guidelines:\n\n1. Generate exactly 5 harmonious colors for each palette.\n2. Provide ONLY hex code format (#RRGGBB) for all colors.\n3. Consider color theory principles (complementary, analogous, monochromatic, triadic, etc.).\n4. Adapt to specific themes, moods, or environments from the user's description.\n5. For specific contexts (corporate, energetic, calming, etc.), provide appropriate color schemes.\n6. Return only the hex codes as a simple list, one per line with no descriptions.\n7. Make sure colors have sufficient contrast between them for good usability.\n8. Each palette should include at least one dark color suitable for text and one light color suitable for backgrounds.\n\nRespond ONLY with the 5 hex color codes, one per line, with no explanations or additional text."
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

