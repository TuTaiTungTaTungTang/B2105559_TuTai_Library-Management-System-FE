import { defineStore } from "pinia";
import type { Member } from "~/models/member";

export const useUserStore = defineStore('user', {
    state: () => ({
        _user: null as Member | null
    }),
    getters: { user: state => state._user },
    actions: {
        setUser(user: Member) {
            this._user = user
        }
    }
})

