"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/features/auth/service";
import type { AuthResponse } from "@/features/auth/types";

const PERSIST_KEY = "auth";

if (typeof window !== "undefined") {
	try {
		const hasSession = sessionStorage.getItem(PERSIST_KEY);
		const remembered = localStorage.getItem(PERSIST_KEY);
		if (!hasSession && remembered) {
			sessionStorage.setItem(PERSIST_KEY, remembered);
		}
	} catch {}
}

type User = AuthResponse["data"]["user"];

type AuthState = {
	user: User | null;
	remember: boolean;
	loading: boolean;
	error: string | null;
};

type AuthActions = {
	login: (args: {
		email: string;
		password: string;
		remember?: boolean;
	}) => Promise<void>;
	logout: () => void;
	setFromAuthResponse: (data: AuthResponse["data"], remember: boolean) => void;
	clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set) => ({
			user: null,
			remember: false,
			loading: false,
			error: null,

			clearError: () => set({ error: null }),

			setFromAuthResponse: (data, remember) => {
				set({
					user: data.user,
					remember,
					loading: false,
					error: null,
				});

				if (typeof window !== "undefined") {
					try {
						const snapshot = sessionStorage.getItem(PERSIST_KEY);
						if (remember && snapshot) {
							localStorage.setItem(PERSIST_KEY, snapshot);
						} else {
							localStorage.removeItem(PERSIST_KEY);
						}
					} catch {}
				}
			},

			login: async ({ email, password, remember }) => {
				set({ loading: true, error: null });
				try {
					const res = await authService.login({ email, password, remember });

					console.log(res);

					const data = res.data;
					const { user } = data;

					set((s) => s);
					useAuthStore.getState().setFromAuthResponse(data, !!remember);
				} catch (e: unknown) {
					set({
						loading: false,
						error: (e as Error)?.message || "Error al iniciar sesión",
					});
					throw e;
				}
			},

			logout: () => {
				set({ user: null, remember: false, loading: false, error: null });
				if (typeof window !== "undefined") {
					try {
						sessionStorage.removeItem(PERSIST_KEY);
						localStorage.removeItem(PERSIST_KEY);
					} catch {}
				}
			},
		}),
		{
			name: PERSIST_KEY,
			version: 1,
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				user: state.user,
				remember: state.remember,
			}),
		}
	)
);
