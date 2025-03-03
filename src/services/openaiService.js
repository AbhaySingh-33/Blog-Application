import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Access env variable in Vite
  dangerouslyAllowBrowser: true, // Allow running in a browser environment
});

export const generateBlog = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": prompt},
      ],
    });
    
    console.log(completion.choices[0].message);
    return completion.choices[0].message.content;
    
  } catch (error) {
    console.error("Error generating blog:", error);
  }
};