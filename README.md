# Personal Website with AI Chatbot

An interactive personal website that allows visitors to learn about me through a dynamic, AI-driven chat interface. This project leverages modern web development practices and AI-powered natural language processing to deliver an engaging user experience.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)

## Overview

This project transforms a traditional personal website into an interactive experience. Instead of static content, visitors are greeted with a chatbot interface where they can ask questions about my background, projects, skills, hobbies, and more. The chatbot provides answers based on a curated knowledge base that includes my biography, portfolio highlights, achievements, and other relevant information. The aim is to showcase both my professional journey and technical skills in an engaging, conversational manner.

## Features

- **Chat Interface (Home Page):**
  - A user-friendly chat box where visitors can type in questions.
  - Starter prompts and suggested questions to guide the conversation.

- **Knowledge Base:**
  - Consolidated data on my biography, portfolio, and achievements.
  - A structured repository for the AI to retrieve relevant information.

- **AI Model Integration:**
  - Integration with an AI API (OpenAI’s GPT-4o and GPT-4o mini).
  - Use of retrieval-augmented generation (RAG) to fetch context from the knowledge base in real time and generate natural language responses.

- **Dynamic UI Enhancements:**
  - Client-side functionality to dynamically reveal additional text and images based on specific keywords in the API response.
  - Real-time updates without the need for page refreshes, enhancing the user experience.

## Technologies Used

- **Frontend:**
  - HTML, CSS, and JavaScript to build the chat interface.
  - React for a dynamic and interactive user experience.

- **Backend & AI Integration:**
  - Node.js to build the API that communicates with the AI model.
  - OpenAI’s GPT-4o and GPT-4o mini for generating responses.
  - A vector database (Pinecone) to implement retrieval-augmented generation.

- **Development Tools:**
  - Flowise for AI model integration.
  - Render for hosting the web application.

## How It Works

1. **User Interaction:**
   - Visitors enter questions in the chat interface on the homepage.
   - The chatbot greets users with a friendly introductory message.

2. **Data Retrieval:**
   - The user query is processed and embedded into a vector space.
   - The system retrieves the most relevant chunks of data from my knowledge base based on the query.

3. **AI Response Generation:**
   - The retrieved data is combined with the user query and sent to the AI model.
   - The AI generates a natural language response that reflects my personal style and expertise.

4. **Dynamic UI Updates:**
   - If the API response contains certain keywords, additional text and images are dynamically revealed on the client side.
   - All updates occur in real-time, providing a seamless user experience.

