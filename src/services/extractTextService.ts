import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";


export interface TextContent {
    title: string;
    content: string;
}

export const extractTextFromUrl = async (url: string): Promise<TextContent | null> => {
    const response = await axios.get(url,{
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive"
        }
    });
    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article) {
        console.log("No readable content found");
        return null;
    }

    return {
        title: article.title || "",
        content: article.textContent || ""
    };
};