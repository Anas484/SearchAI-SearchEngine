import type { Request, Response } from "express";
import { searchInQdrant } from "../services/searchQuadrant.js";
import { generateAnswer} from "../services/SearchGemini.js"


export const searchQueryInQuadrant = async (req: Request, res: Response) => {
    try {
  const query = req.body.query;

  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: "Query is required" });
    return;
  }

  const results = await searchInQdrant(query);

  const context = results
    .map((r, i) => {
      const text = (r.payload?.pageContent as string) ?? "";
      const source = (r.payload?.metadata as any)?.source ?? "unknown";
      return `[${i + 1}] ${source}\n${text}`;
    })
    .filter((entry) => entry.trim().length > 0)
    .join("\n\n---\n\n");

  if (!context.trim()) {
    res.json({ answer: "I couldn't find any relevant information for that query." });
    return;
  }
  console.log("CONTEXT:", context);

  const answer = await generateAnswer(query, context);

  res.json({ answer: answer.trim().replace(/\n{3,}/g, '\n\n') });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
};