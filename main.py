from fastapi import FastAPI, HTTPException, Query
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from pydantic import BaseModel
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter
from fastapi.middleware.cors import CORSMiddleware
from pinecone import ServerlessSpec
from pinecone.grpc import PineconeGRPC as Pinecone
from langchain_pinecone import PineconeVectorStore
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

###CONSTANTS

MODEL = "llama3.1"
# MODEL = "gemma:2b"

model = Ollama(model=MODEL)
embeddings = OllamaEmbeddings()
parser = StrOutputParser()
index_name = "ncert-assistant"

loader = PyPDFLoader("iesc111.pdf")
pages = loader.load_and_split()


# pc.create_index(
#     name=index_name,
#     dimension=4096, # Replace with your model dimensions
#     metric="cosine", # Replace with your model metric
#     spec=ServerlessSpec(
#         cloud="aws",
#         region="us-east-1"
#     ) 
# )
    


# vectorstore = DocArrayInMemorySearch.from_documents(
#     pages, 
#     embedding = embeddings
# )
vectorstore = PineconeVectorStore.from_documents(
    pages, 
    embedding = embeddings,
    index_name = index_name
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
async def home():
    return "Success!"

@app.post("/ask")
async def ask(request: QuestionRequest):
    question = request.question

    retriever = vectorstore.as_retriever()

    template = """
    Answer the question based on the context below. If you can't 
    answer the question, reply "I don't know".

    Context: {context}

    Question: {question}
    """

    prompt = PromptTemplate.from_template(template)

    chain = (
        {
            "context": itemgetter("question") | retriever,
            "question": itemgetter("question"),
        }
        | prompt
        | model
        | parser
    )

    answer = chain.invoke({"question": question})
    
    return {"answer": answer}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


