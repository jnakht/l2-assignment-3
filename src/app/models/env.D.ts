import express from "express"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string
    }
  }
}