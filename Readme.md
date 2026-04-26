# AI Search Engine 🚀

A powerful, intelligent search engine built with Node.js, TypeScript, and cutting-edge AI technologies. This system combines vector search, RAG (Retrieval-Augmented Generation), and message queuing to deliver accurate, context-aware search results from PDF documents.

## ✨ Key Features

### 🧠 Advanced Search Capabilities
- **Vector Search**: Utilizes Qdrant vector database for semantic similarity search
- **RAG Implementation**: Combines retrieval with generation using Google's Gemini 2.5 Flash Lite
- **PDF Processing**: Intelligent text extraction and chunking from PDF documents
- **Context-Aware Responses**: Provides answers based on retrieved document context

### 🏗️ Robust Architecture
- **Message Queuing**: RabbitMQ for reliable, asynchronous data processing
- **Vector Embeddings**: 384-dimensional embeddings using @xenova/transformers
- **Database Integration**: PostgreSQL with Prisma ORM for structured data
- **RESTful API**: Express.js backend with comprehensive search endpoints

### 📊 Data Management
- **Automated Processing**: Streaming pipeline for PDF document ingestion
- **Checkpoint System**: Recovery mechanisms for processing failures
- **Batch Processing**: Efficient handling of large document collections
- **Metadata Storage**: Complete document source tracking and management

## 🛠️ Technology Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **Prisma** ORM with PostgreSQL
- **RabbitMQ** for message queuing
- **Redis** for caching

### AI & ML
- **Google Gemini 2.5 Flash Lite** for text generation
- **@xenova/transformers** for embeddings
- **Qdrant** vector database
- **LangChain** for text processing

### Document Processing
- **pdf-parse** for PDF text extraction
- **@mozilla/readability** for content cleaning
- **jsdom** for DOM manipulation
- **RecursiveCharacterTextSplitter** for intelligent chunking

## 📁 Project Structure

```
src/
├── configs/          # Configuration files (RabbitMQ, Qdrant)
├── controllers/      # API route controllers
├── routes/          # Express route definitions
├── services/        # Business logic and AI services
│   ├── SearchGemini.ts      # Gemini AI integration
│   ├── streamData.ts        # PDF processing pipeline
│   ├── consumeData.ts       # Message queue consumer
│   ├── embeddedText.ts      # Text vectorization
│   ├── extractTextService.ts # PDF text extraction
│   └── searchQuadrant.ts    # Vector search operations
├── index.ts         # Application entry point
├── import_orders.ts # Data import utilities
└── insertPoetryData.ts # Poetry data management
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- RabbitMQ
- Redis (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai_search_engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the application**
   ```bash
   npm start
   ```

The server will start on port 3000.

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `RABBITMQ_URL`: RabbitMQ connection URL
- `QDRANT_HOST`: Qdrant vector database host
- `REDIS_URL`: Redis connection URL (optional)

### Document Processing
- Place PDF documents in the `books/` directory
- Documents are automatically processed and indexed on startup
- Text is chunked into 500-character segments with 100-character overlap

## 📡 API Endpoints

### Search
```http
POST /search
Content-Type: application/json

{
  "query": "your search query here"
}
```

**Response:**
```json
{
  "answer": "AI-generated response based on document context"
}
```

## 🔄 Workflow

1. **Document Ingestion**: PDFs are processed and text extracted
2. **Text Chunking**: Content is split into manageable segments
3. **Vectorization**: Text chunks are converted to embeddings
4. **Queue Processing**: Data flows through RabbitMQ for reliable processing
5. **Vector Storage**: Embeddings stored in Qdrant with metadata
6. **Search Query**: User queries are vectorized and matched against stored vectors
7. **Context Retrieval**: Relevant document chunks are retrieved
8. **AI Generation**: Gemini generates answers using retrieved context

## 🎯 Use Cases

- **Document Search**: Search through large PDF collections
- **Research Assistant**: Get answers from technical documents
- **Knowledge Base**: Create searchable knowledge repositories
- **Content Discovery**: Find relevant information across documents
- **Academic Research**: Search through research papers and articles

## 🔍 Recent Updates

### Latest Features (v1.0.0)
- ✅ Implemented RAG architecture with Gemini 2.5 Flash Lite
- ✅ Added RabbitMQ for reliable message processing
- ✅ Integrated Qdrant vector database for semantic search
- ✅ Built automated PDF processing pipeline
- ✅ Added checkpoint system for processing recovery
- ✅ Implemented comprehensive error handling
- ✅ Created RESTful API with Express.js
- ✅ Added TypeScript support throughout the application

### Performance Improvements
- Optimized vector embeddings with 384-dimensional space
- Implemented batch processing for large document collections
- Added timeout handling for AI API calls
- Configurable text chunking parameters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini for powerful AI capabilities
- Qdrant for efficient vector search
- RabbitMQ for reliable message queuing
- LangChain for text processing utilities
- The open-source community for the amazing tools that make this project possible

---

**Built with ❤️ using modern AI technologies**