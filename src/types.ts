// src/types.ts
/**
 * Tipos compartidos entre módulos.
 */

export interface Env {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
}

export interface ConnectionRecord {
	id?: string;
	type: string;
	user_id: string;
	message: string;
	created_at?: string;
}
