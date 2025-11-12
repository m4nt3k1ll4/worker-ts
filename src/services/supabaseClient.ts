
/**
 * Inicialización del cliente Supabase usando @supabase/supabase-js.
 * - No almacena sesiones.
 * - Se crea un cliente por invocación, pero la función permite reutilización si el runtime lo hace.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Env } from "../types";
/**
 * Devuelve una instancia de SupabaseClient configurada con las variables del entorno.
 * No debe incluir claves en el código; usar env vars seguras.
 */
export function getSupabaseClient(env: Env): SupabaseClient {
	if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
		throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment");
	}

	// createClient exportado por supabase-js
	const client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
		auth: { persistSession: false }, // evitar persistencia en edge runtimes
	});

	return client;
}
