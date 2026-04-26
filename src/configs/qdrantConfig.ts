import { QdrantClient } from "@qdrant/js-client-rest";


const createQdrantConnection = async () =>{
    const qdrant = await new QdrantClient({
        url: "http://localhost:6333",
    });
    return qdrant;
}

const createCollection = async (qdrant: QdrantClient) => {
    await qdrant.createCollection('story', {
        vectors: {
        size: 384,
        distance: "Cosine",
        }
    })
}

export {
    createQdrantConnection,
    createCollection
};