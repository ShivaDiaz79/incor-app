export interface User {
	uid: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "admin" | "user";
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}
