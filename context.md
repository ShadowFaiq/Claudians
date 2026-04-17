# Project Context: AI Hackathon App

## 🏗️ Project Architecture
This is a monorepo containing a separate frontend and backend.
- **/frontend**: Next.js 14 application using the App Router.
- **/backend**: FastAPI application running on Python 3.10+.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI, Pydantic v2, Uvicorn.
- **AI Orchestration**: Vercel AI SDK (using Data Stream Protocol).
- **AI Models**: Hugging Face Inference API (avoiding local model loading).
- **Database/Auth**: Firebase (using Firebase v9 Modular SDK for frontend and firebase-admin for backend).

## 🔌 Communication & Ports
- **Frontend Port**: 3000
- **Backend Port**: 8000
- **Base URL**: http://localhost:8000
- **CORS**: Enabled on the backend to allow requests from http://localhost:3000.

## 📜 Coding Rules & Standards
1. **Next.js**: Use Server Components where possible; use 'use client' only for interactive UI.
2. **FastAPI**: Use Python type hints for all function signatures and Pydantic models for request/response validation.
3. **Streaming**: The backend must format stream chunks as `0:"text"` to be compatible with the Vercel AI SDK `useChat` hook.
4. **Firebase**: Use the modular SDK (`import { initializeApp } from "firebase/app"`) rather than the old namespace SDK.
5. **No Local Models**: Do not use `transformers.pipeline()` locally. All AI calls must go through the Hugging Face Inference API.

## 📂 Data Shapes
- **Chat Message**: `{ id: string, role: 'user' | 'assistant', content: string }`
- **User Profile**: `{ uid: string, email: string, createdAt: timestamp }`