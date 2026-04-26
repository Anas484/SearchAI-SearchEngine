import { createQdrantConnection } from "../configs/qdrantConfig.js";
import VectorizeData from "./embeddedText.js";


const qdrant = await createQdrantConnection();


const searchInQdrant = async(text : string) => {
    const vetorized = await VectorizeData(text)
    const results = await qdrant.search('poetry',{
        vector:Array.from(vetorized),
        limit:10,
        with_payload:true
    })
    return results
}


export {
    searchInQdrant
}