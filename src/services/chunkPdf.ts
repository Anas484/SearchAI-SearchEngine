import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const extractText = async (filePath: string) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs;
};


const chunkByParagraph = (doc: any) => {
  const paragraphs= doc.pageContent
    .split("\n")
    .map((p: any) => p.trim())
    .filter((p: any) => p.length > 50);

  return paragraphs.map((p: any, i: any) => ({
    pageContent: p,
    metadata: {
      ...doc.metadata,
      chunkIndex: i,
    },
  }));
};

export {
    chunkByParagraph,
    extractText
}