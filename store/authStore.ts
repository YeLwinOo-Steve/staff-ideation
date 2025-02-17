import { create } from "zustand"

type User = {
    id: string
    name: string
    email: string
}

type AuthStore = {
    user: User | null
    login: (email: string, password: string) => void
    signup: (name: string, email: string, password: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    login: (email, password) => {
        set({ user: { id: "1", name: "John Doe", email } })
    },
    signup: (name, email, password) => {
        set({ user: { id: "2", name, email } })
    },
    logout: () => {
        set({ user: null })
    },
}))

