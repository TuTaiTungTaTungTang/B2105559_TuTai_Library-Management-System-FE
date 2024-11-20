import { defineStore } from "pinia";
import type { Librarian } from "~/models/librarian";

export const useUserStore = defineStore('user', {
    state: () => ({
        _user: null as Librarian | null
    }),
    getters: { user: state => state._user },
    actions: {
        setUser(user: Librarian) {
            this._user = user
        }
    }
})