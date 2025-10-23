export interface RegisterDto {
	email: string;
	password?: string | null;
	role: "admin" | "user" | "manager";
	provider: string;
	provider_id: string;
	firstname: string;
	middlename?: string | null;
	lastname: string;
	contacts?: string | null;
	birthday?: string | null;
	address?: string | null;
	gender?: "male" | "female" | null;
}

