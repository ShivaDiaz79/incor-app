export type ISODate = string;

export type ISODateTime = string;

export interface PatientEmergencyContactDto {
	name: string;
	phone: string;
	relationship: string;
}

export interface PatientCreateDto {
	name: string;
	lastName: string;
	email?: string;
	phone: string;
	ci: string;
	dateOfBirth: ISODate;
	address: string;
	whatsappNumber?: string;
	emergencyContact: PatientEmergencyContactDto;
	medicalHistory?: string[];
	allergies?: string[];
	isActive?: boolean;
}

export interface PatientDto {
	id: string;
	name: string;
	lastName: string;
	email?: string;
	phone: string;
	ci: string;
	dateOfBirth: ISODateTime;
	address: string;
	whatsappNumber?: string;
	emergencyContact: PatientEmergencyContactDto;
	medicalHistory: string[];
	allergies: string[];
	isActive: boolean;
	createdAt: ISODateTime;
	updatedAt: ISODateTime;
	fullName: string;
	age: number;
}

export interface PatientUpdateDto {
	name?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	ci?: string;
	dateOfBirth?: ISODate;
	address?: string;
	whatsappNumber?: string;
	emergencyContact?: PatientEmergencyContactDto;
	medicalHistory?: string[];
	allergies?: string[];
	isActive?: boolean;
}

export interface PatientAgeRanges {
	"0-18": number;
	"19-30": number;
	"31-50": number;
	"51-70": number;
	"70+": number;
}

export interface PatientStats {
	total: number;
	active: number;
	inactive: number;
	withWhatsapp: number;
	ageRanges: PatientAgeRanges;
}

export interface PatientStatsEnvelope {
	data: PatientStats;
	statusCode: number;
	timestamp: string;
	message: string;
}

export interface Patient {
	id: string;
	name: string;
	lastName: string;
	email?: string;
	phone: string;
	ci: string;
	dateOfBirth: Date | null;
	address: string;
	whatsappNumber?: string;
	emergencyContact: PatientEmergencyContactDto;
	medicalHistory: string[];
	allergies: string[];
	isActive: boolean;
	createdAt: Date | null;
	updatedAt: Date | null;
	fullName: string;
	age: number;
}
