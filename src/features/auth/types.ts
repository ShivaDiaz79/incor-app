export type AuthResponse = {
	data: {
		user: {
			id: string;
			email: string;
			name: string;
			lastName: string;
			roleId: string;
		};
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};
	statusCode: number;
	timestamp: string;
	message: string;
};
