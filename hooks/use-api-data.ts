"use client"

import { useEffect } from "react"
import { useAppState } from "@/contexts/app-state-context"
import api from "@/services/api"

// Hook for fetching users
export const useUsers = () => {
  const { state, dispatch } = useAppState()

  const fetchUsers = async () => {
    try {
      dispatch({ type: "SET_LOADING", resource: "users", isLoading: true })
      dispatch({ type: "SET_ERROR", resource: "users", error: null })

      const response = await api.users.getAll()
      dispatch({ type: "SET_USERS", payload: response.data })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        resource: "users",
        error: error instanceof Error ? error.message : "Failed to fetch users",
      })
    } finally {
      dispatch({ type: "SET_LOADING", resource: "users", isLoading: false })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users: state.users,
    isLoading: state.isLoading.users,
    error: state.errors.users,
    refetch: fetchUsers,
  }
}

// Hook for fetching bots
export const useBots = () => {
  const { state, dispatch } = useAppState()

  const fetchBots = async () => {
    try {
      dispatch({ type: "SET_LOADING", resource: "bots", isLoading: true })
      dispatch({ type: "SET_ERROR", resource: "bots", error: null })

      const response = await api.bots.getAll()
      dispatch({ type: "SET_BOTS", payload: response.data })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        resource: "bots",
        error: error instanceof Error ? error.message : "Failed to fetch bots",
      })
    } finally {
      dispatch({ type: "SET_LOADING", resource: "bots", isLoading: false })
    }
  }

  useEffect(() => {
    fetchBots()
  }, [])

  return {
    bots: state.bots,
    isLoading: state.isLoading.bots,
    error: state.errors.bots,
    refetch: fetchBots,
  }
}

// Hook for fetching conversations
export const useConversations = () => {
  const { state, dispatch } = useAppState()

  const fetchConversations = async () => {
    try {
      dispatch({ type: "SET_LOADING", resource: "conversations", isLoading: true })
      dispatch({ type: "SET_ERROR", resource: "conversations", error: null })

      const response = await api.conversations.getAll()
      dispatch({ type: "SET_CONVERSATIONS", payload: response.data })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        resource: "conversations",
        error: error instanceof Error ? error.message : "Failed to fetch conversations",
      })
    } finally {
      dispatch({ type: "SET_LOADING", resource: "conversations", isLoading: false })
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations: state.conversations,
    isLoading: state.isLoading.conversations,
    error: state.errors.conversations,
    refetch: fetchConversations,
  }
}

// Hook for fetching a single user
export const useUser = (userId: string) => {
  const { state, dispatch } = useAppState()

  const fetchUser = async () => {
    try {
      dispatch({ type: "SET_LOADING", resource: "users", isLoading: true })
      dispatch({ type: "SET_ERROR", resource: "users", error: null })

      const response = await api.users.getById(userId)
      // Update the user in the state if it exists, otherwise add it
      const userExists = state.users.some((user) => user.id === response.data.id)
      if (userExists) {
        dispatch({ type: "UPDATE_USER", payload: response.data })
      } else {
        dispatch({ type: "ADD_USER", payload: response.data })
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        resource: "users",
        error: error instanceof Error ? error.message : `Failed to fetch user ${userId}`,
      })
    } finally {
      dispatch({ type: "SET_LOADING", resource: "users", isLoading: false })
    }
  }

  useEffect(() => {
    fetchUser()
  }, [userId])

  return {
    user: state.users.find((user) => user.id === userId),
    isLoading: state.isLoading.users,
    error: state.errors.users,
    refetch: fetchUser,
  }
}

// Similar hooks can be created for single bot and conversation fetching
