"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { User } from "@/types/user"
import type { Bot } from "@/types/bot"
import type { Conversation } from "@/types/conversation"

// Define the state shape
interface AppState {
  currentUser: User | null
  users: User[]
  bots: Bot[]
  conversations: Conversation[]
  isLoading: {
    users: boolean
    bots: boolean
    conversations: boolean
  }
  errors: {
    users: string | null
    bots: string | null
    conversations: string | null
  }
}

// Define action types
type Action =
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "REMOVE_USER"; payload: string }
  | { type: "SET_BOTS"; payload: Bot[] }
  | { type: "ADD_BOT"; payload: Bot }
  | { type: "UPDATE_BOT"; payload: Bot }
  | { type: "REMOVE_BOT"; payload: string }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "ADD_CONVERSATION"; payload: Conversation }
  | { type: "UPDATE_CONVERSATION"; payload: Conversation }
  | { type: "REMOVE_CONVERSATION"; payload: string }
  | { type: "SET_LOADING"; resource: "users" | "bots" | "conversations"; isLoading: boolean }
  | { type: "SET_ERROR"; resource: "users" | "bots" | "conversations"; error: string | null }

// Initial state
const initialState: AppState = {
  currentUser: null,
  users: [],
  bots: [],
  conversations: [],
  isLoading: {
    users: false,
    bots: false,
    conversations: false,
  },
  errors: {
    users: null,
    bots: null,
    conversations: null,
  },
}

// Create the reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }

    case "SET_USERS":
      return { ...state, users: action.payload }

    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] }

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      }

    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        currentUser: state.currentUser?.id === action.payload ? null : state.currentUser,
      }

    case "SET_BOTS":
      return { ...state, bots: action.payload }

    case "ADD_BOT":
      return { ...state, bots: [...state.bots, action.payload] }

    case "UPDATE_BOT":
      return {
        ...state,
        bots: state.bots.map((bot) => (bot.id === action.payload.id ? action.payload : bot)),
      }

    case "REMOVE_BOT":
      return {
        ...state,
        bots: state.bots.filter((bot) => bot.id !== action.payload),
      }

    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload }

    case "ADD_CONVERSATION":
      return { ...state, conversations: [...state.conversations, action.payload] }

    case "UPDATE_CONVERSATION":
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.payload.id ? action.payload : conversation,
        ),
      }

    case "REMOVE_CONVERSATION":
      return {
        ...state,
        conversations: state.conversations.filter((conversation) => conversation.id !== action.payload),
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.resource]: action.isLoading,
        },
      }

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.resource]: action.error,
        },
      }

    default:
      return state
  }
}

// Create the context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppStateContext = createContext<AppContextType | undefined>(undefined)

// Create the provider component
export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}

// Create a custom hook to use the context
export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
