import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatController = async (req, res) => {
    try {
        const { text } = req.body;

        // OpenAI client
        const openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Google Gemini client
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Querying OpenAI (GPT-4o-mini)
        const openaiResponse = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
        You are an expert design assistant for PPost Designer, powered by Konva.js. Always output **only** a JSON object named 'canvas' that fully describes a polished, production-ready hiring post layout. Follow these rules:

1. **Canvas Setup**  
   - Top-level object:  
     """json
     {
                    "canvas": {
                        "width": 800,
                        "height": 600,
                        "elements": [ …]
                    }
                }
                    """
   - No extra keys or narrative—strict JSON.

2. **Background**  
   - Include a 'Rect' covering the entire canvas with either a subtle gradient or soft solid fill.  
   - Use 'cornerRadius', 'stroke', and 'shadow' props for depth.

3. **Typography**  
   - Title, subtitle, body, and CTA as separate 'Text' nodes.  
   - Use clear hierarchy: Title ≥32 px, Subtitle ≥24 px, Body 16–18 px, CTA 20–24 px.  
   - Apply 'fontFamily', 'fontStyle', and 'fill' colors that contrast well with background.  
   - Add slight 'shadowBlur' or 'opacity' accents on CTA.

4. **Shapes & Accents**  
   - Add at least two decorative shapes ('Circle', 'Rect' with 'cornerRadius').  
   - Use 'fill', 'stroke', and low-opacity overlays for highlights.  
   - Position shapes to frame key text areas.

5. **Gesture Lines & Dividers**  
   - Include one or more 'Line' or 'Path' elements to guide the eye.  
   - Use dashed strokes or partial opacity.

6. **Z-ordering & Rotation**  
   - Assign each element a unique 'id' and appropriate 'zIndex'.  
   - Add subtle 'rotation' (±5°–10°) on decorative elements or CTA for dynamism.

7. **Shadows & Borders**  
   - Use 'shadowColor', 'shadowOffset', 'shadowBlur' on key elements (cards, CTA).  
   - Use 'stroke' and 'strokeWidth' to define sections or callouts.

8. **Content**  
   - Use realistic, concise copy for an “HR Manager” hiring post:
     - **Title:** "Join Our Team: HR Manager"  
     - **Subtitle:** "Shape Culture • Empower People"  
     - **Body:** 4–5 bullets of core responsibilities and 3–4 bullets of benefits.  
     - **CTA:** "Apply Now" or "Submit Your Resume".

9. **Final Output**  
   - Entire response must be the JSON payload; no markdown, no explanation.

Example element entry:

"""json
{
  "type": "Text",
  "id": "title",
  "props": {
    "x": 50,
    "y": 80,
    "text": "Join Our Team: HR Manager",
    "fontSize": 36,
    "fontFamily": "Arial",
    "fill": "#2C3E50",
    "shadowColor": "rgba(0,0,0,0.2)",
    "shadowBlur": 4,
    "zIndex": 5
  }
}
 `.trim()
                },
                {
                    role: "user",
                    content: text
                }
            ],
            max_tokens: 2000,
        });

        let combinedResponse = {
            openai: openaiResponse.choices[0].message.content,
            google: null
        };

        // Querying Google Gemini with error handling
        try {
            const geminiResponse = await geminiModel.generateContent(text);
            const geminiResult = await geminiResponse.response.text();
            combinedResponse.google = geminiResult;
        } catch (geminiError) {
            console.error("Gemini API Error:", geminiError.message);
            combinedResponse.google = "Error fetching response from Gemini API";
        }

        res.status(200).json({
            success: true,
            data: combinedResponse
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
