import { pipeline } from "@xenova/transformers";

const VectorizeData = async (text: string) : Promise<any> =>  {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
    });

    const vector = output.data;
    return vector;
};

export default VectorizeData;