import type { Request, Response } from "express";
import { searchInQdrant } from "../services/searchQuadrant.js";
import { generateAnswer} from "../services/SearchGemini.js"


export const searchQueryInQuadrant = async (req: Request, res: Response) => {
    try {
        const query = req.body.query;
        console.log("BODY:", req.body);
        console.log("QUERY:", query);
        const results = await searchInQdrant(query);
        console.log("RESULTS:", results);
        const context = results
            .map((r, i) => {
                const text = (r.payload?.pageContent as string) ?? "";
                const source = (r.payload?.metadata as any)?.source ?? "unknown";
                return `[${i + 1}] ${source}\n${text}`;
            })
            .join("\n\n---\n\n");
        
        const answer = await generateAnswer(query,context)
        res.json({ answer: answer.replace(/\n/g, '') });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};