import { GoogleGenerativeAI } from "@google/generative-ai";

// Summarize a blog post
export const summarizeBlog = async (req, res) => {
    try {
        const { blogContent, title } = req.body;
        
        if (!blogContent) {
            return res.status(400).json({
                success: false,
                error: "Blog content is required"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a helpful assistant that creates concise, informative summaries of blog posts. Provide a clear summary that captures the main points and key insights. Keep it engaging and professional.

Please summarize this blog post${title ? ` titled "${title}"` : ''}:

${blogContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.status(200).json({
            success: true,
            data: {
                summary: summary,
                title: title || "Blog Summary"
            }
        });
    } catch (error) {
        console.error("Error summarizing blog:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Search and find relevant blogs based on query
export const searchBlogs = async (req, res) => {
    try {
        const { query, blogs } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: "Search query is required"
            });
        }

        if (!blogs || !Array.isArray(blogs)) {
            return res.status(400).json({
                success: false,
                error: "Blogs array is required"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a prompt with all blog titles/summaries for relevance matching
        const blogList = blogs.map((blog, index) => 
            `${index + 1}. Title: ${blog.title || 'Untitled'}\nSummary: ${blog.summary || blog.content?.substring(0, 200) || 'No summary available'}`
        ).join('\n\n');

        const prompt = `You are a helpful assistant that finds relevant blog posts based on search queries. Analyze the provided blogs and return the most relevant ones with explanations of why they match the query. Return your response as a JSON array with objects containing 'index', 'relevanceScore' (1-10), and 'reason' fields.

Find blogs relevant to the query: "${query}"

Available blogs:
${blogList}

Return only the most relevant blogs (top 5 maximum) in JSON format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        let relevantBlogs;
        try {
            // Extract JSON from the response
            const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                relevantBlogs = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            // Fallback: simple text matching
            relevantBlogs = blogs
                .map((blog, index) => ({
                    index,
                    blog,
                    relevanceScore: calculateSimpleRelevance(query, blog)
                }))
                .filter(item => item.relevanceScore > 0)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, 5);
        }

        // Map the results back to actual blog data
        const results = relevantBlogs.map(item => ({
            ...blogs[item.index],
            relevanceScore: item.relevanceScore,
            reason: item.reason || "Content matches search query"
        }));

        res.status(200).json({
            success: true,
            data: {
                query,
                results,
                totalFound: results.length
            }
        });
    } catch (error) {
        console.error("Error searching blogs:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get blog summary with related links and recommendations
export const getBlogWithRelated = async (req, res) => {
    try {
        const { blogContent, title, allBlogs } = req.body;
        
        if (!blogContent) {
            return res.status(400).json({
                success: false,
                error: "Blog content is required"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // First, get a summary of the current blog
        const summaryPrompt = `Create a concise summary and extract key topics/tags from this blog post. Also suggest related topics that readers might be interested in.

Summarize this blog and suggest related topics:

Title: ${title || 'Untitled'}
Content: ${blogContent}`;

        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryResponse = await summaryResult.response;
        const summary = summaryResponse.text();

        let relatedBlogs = [];
        if (allBlogs && Array.isArray(allBlogs) && allBlogs.length > 0) {
            // Find related blogs
            const blogList = allBlogs.map((blog, index) => 
                `${index + 1}. ${blog.title || 'Untitled'}: ${blog.summary || blog.content?.substring(0, 150) || ''}`
            ).join('\n');

            const relatedPrompt = `Find blogs that are related to the given blog content. Return indices of the most relevant blogs (maximum 3) as a JSON array of numbers.

Based on this blog content: "${blogContent.substring(0, 500)}"

Find related blogs from:
${blogList}`;

            const relatedResult = await model.generateContent(relatedPrompt);
            const relatedResponse = await relatedResult.response;
            const relatedText = relatedResponse.text();

            try {
                const indices = JSON.parse(relatedText);
                relatedBlogs = indices.map(index => allBlogs[index - 1]).filter(Boolean);
            } catch {
                // Fallback to first 3 blogs if parsing fails
                relatedBlogs = allBlogs.slice(0, 3);
            }
        }

        res.status(200).json({
            success: true,
            data: {
                title: title || "Blog Post",
                summary: summary,
                relatedBlogs: relatedBlogs.map(blog => ({
                    title: blog.title,
                    summary: blog.summary || blog.content?.substring(0, 200),
                    link: blog.link || blog.url || '#',
                    id: blog.id
                }))
            }
        });
    } catch (error) {
        console.error("Error getting blog with related content:", error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Helper function for simple text relevance calculation
function calculateSimpleRelevance(query, blog) {
    const queryWords = query.toLowerCase().split(' ');
    const blogText = `${blog.title || ''} ${blog.summary || ''} ${blog.content || ''}`.toLowerCase();
    
    let score = 0;
    queryWords.forEach(word => {
        if (blogText.includes(word)) {
            score += 1;
        }
    });
    
    return score;
} 