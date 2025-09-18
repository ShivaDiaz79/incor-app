export type FirestoreTS = { _seconds: number; _nanoseconds: number };
export type MaybeISODate = string | FirestoreTS | Date | null | undefined;

export function toDate(d: MaybeISODate): Date | null | undefined {
	if (!d) return d as undefined | null;
	if (d instanceof Date) return d;
	if (typeof d === "string") {
		const dt = new Date(d);
		return isNaN(+dt) ? null : dt;
	}
	if (typeof d === "object" && "_seconds" in d && "_nanoseconds" in d) {
		const ms =
			(d as FirestoreTS)._seconds * 1000 +
			Math.floor((d as FirestoreTS)._nanoseconds / 1_000_000);
		return new Date(ms);
	}
	return null;
}

export type ApiUser = {
	id: string;
	email: string;
	name: string;
	lastName: string;
	phone: string;
	roleId: string;
	ci: string;
	isActive: boolean;
	firebaseUid: string;
	createdAt: FirestoreTS;
	updatedAt: FirestoreTS;
};

export type ApiEnvelope<T> = {
	data: T;
	statusCode: number;
	timestamp: string;
	message: string;
};

export type CreateUserResponse = ApiEnvelope<ApiUser>;

export type User = {
	id: string;
	email: string;
	name: string;
	lastName: string;
	phone: string;
	roleId: string;
	ci: string;
	isActive: boolean;
	firebaseUid: string;
	createdAt?: Date | null;
	lastLoginAt?: Date | null;
	updatedAt?: Date | null;
};

export type GetAllParams = {
	page?: number;
	limit?: number;
	search?: string;
	isActive?: boolean;
	roleId?: string;
};

export type GetAllResponse = {
	items: User[];
	total?: number;
	page?: number;
	limit?: number;
};
