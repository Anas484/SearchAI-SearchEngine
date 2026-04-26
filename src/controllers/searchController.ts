import type { Request, Response } from "express";
import { searchInQdrant } from "../services/searchQuadrant.js";


export const searchQueryInQuadrant = async (req: Request, res: Response) => {
    try {
        const query = req.body.query;
        console.log("BODY:", req.body);
        console.log("QUERY:", query);
        const results = await searchInQdrant(query);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};