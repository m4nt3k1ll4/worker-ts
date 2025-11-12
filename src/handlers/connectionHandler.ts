/**
 * Handler HTTP que enruta y valida requests para /api/connections.
 * - Orquesta: validaciones -> llamadas a service -> respuestas.
 * - Utiliza funciones de utils para respuestas y validación.
 * - Solo usa JSONPlaceholder en GET para simular dependencia externa.
 */


import type { SupabaseClient } from "@supabase/supabase-js";
import type { Env, ConnectionRecord } from "../types";
import { getSupabaseClient } from "../services/supabaseClient";
import {
	listConnections,
	getConnectionById,
	createConnection,
	updateConnection,
	deleteConnection,
} from "../services/connectionService";
import {
	validateConnectionPayload,
	validatePartialConnectionPayload,
} from "../utils/validation";
import { jsonResponse } from "../utils/response";

async function probeJsonPlaceholder(): Promise<{ ok: boolean; status: number; sample?: unknown }> {
	try {
		const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
		const sample = res.ok ? await res.json().catch(() => null) : null;
		return { ok: res.ok, status: res.status, sample };
	} catch {
		return { ok: false, status: 0 };
	}
}

function extractIdFromPath(pathname: string): string | null {
	const segments = pathname.split("/").filter(Boolean);
	if (segments.length === 3 && segments[0] === "api" && segments[1] === "connections") {
		return segments[2];
	}
	return null;
}

function handleOptions(): Response {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}

export async function handleConnectionsRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const pathname = url.pathname;

	if (request.method === "OPTIONS") return handleOptions();

	if (!pathname.startsWith("/api/connections")) {
		return jsonResponse({ status: "error", message: "Ruta no encontrada" }, 404);
	}

	let supabase: SupabaseClient;
	try {
		supabase = getSupabaseClient(env);
	} catch (err: unknown) {
		console.error("Supabase client init error:", err);
		return jsonResponse({ status: "error", message: "Error de configuración del servicio" }, 500);
	}

	try {
		const id = extractIdFromPath(pathname);

		if (request.method === "GET") {
			const probe = await probeJsonPlaceholder();
			if (id) {
				const record = await getConnectionById(supabase, id);
				if (!record) return jsonResponse({ status: "error", message: "Registro no encontrado" }, 404);
				return jsonResponse({ status: "success", message: "Registro obtenido", data: { record, probe } });
			} else {
				const records = await listConnections(supabase);
				return jsonResponse({ status: "success", message: "Listado obtenido", data: { records, probe } });
			}
		}

		if (request.method === "POST") {
			const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
			const validationError = validateConnectionPayload(body);
			if (validationError) return jsonResponse({ status: "error", message: validationError }, 400);

			const created = await createConnection(supabase, {
				type: body!.type as string,
				user_id: body!.user_id as string,
				message: body!.message as string,
			});
			return jsonResponse({ status: "success", message: "Registro creado correctamente", data: created }, 201);
		}

		if ((request.method === "PUT" || request.method === "PATCH") && id) {
			const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
			const partialError = validatePartialConnectionPayload(body);
			if (partialError) return jsonResponse({ status: "error", message: partialError }, 400);

			const updated = await updateConnection(supabase, id, body as Partial<ConnectionRecord>);
			return jsonResponse({ status: "success", message: "Registro actualizado", data: updated });
		}

		if (request.method === "DELETE" && id) {
			const deleted = await deleteConnection(supabase, id);
			return jsonResponse({ status: "success", message: "Registro eliminado", data: deleted });
		}

		return jsonResponse({ status: "error", message: "Método no permitido o ruta inválida" }, 405);
	} catch (err: unknown) {
		console.error("Error en handler:", err);
		const message = err instanceof Error ? err.message : "Error interno del servidor";
		return jsonResponse({ status: "error", message }, 500);
	}
}
