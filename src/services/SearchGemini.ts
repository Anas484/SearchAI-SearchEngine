import dotenv from 'dotenv'
dotenv.config()


const generateAnswer = async (query: string, context: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
  You are a helpful assistant. Answer the user's question using ONLY the context below.

Context:
${context}

Question:
${query}
                  `,
                },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    throw error;
  }

  const data = await response.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
};


export{
    generateAnswer
}