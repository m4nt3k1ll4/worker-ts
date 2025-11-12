/**
 * Validaciones para el payload de ts_connection.
 * - validateConnectionPayload: validación completa para creación (POST).
 * - validatePartialConnectionPayload: validación parcial para actualizaciones (PUT/PATCH).
 */

import type { ConnectionRecord } from "../types";

/**
 * Devuelve null si válido, o string con mensaje de error.
 */
export function validateConnectionPayload(body: unknown): string | null {
	if (!body || typeof body !== "object") return "Payload inválido: se espera un objeto JSON";

	const b = body as Partial<ConnectionRecord>;
	if (!b.type || typeof b.type !== "string") return "Campo 'type' obligatorio de tipo string";
	if (!b.user_id || typeof b.user_id !== "string") return "Campo 'user_id' obligatorio de tipo string";
	if (!b.message || typeof b.message !== "string") return "Campo 'message' obligatorio de tipo string";

	return null;
}

/**
 * Validación parcial: al menos un campo y tipos correctos si existen.
 */
export function validatePartialConnectionPayload(body: unknown): string | null {
	if (!body || typeof body !== "object") return "Payload inválido: se espera un objeto JSON";

	const b = body as Partial<ConnectionRecord>;
	const keys = Object.keys(b);
	if (keys.length === 0) return "Payload vacío para actualización";

	if (b.type !== undefined && typeof b.type !== "string") return "Campo 'type' debe ser string";
	if (b.user_id !== undefined && typeof b.user_id !== "string") return "Campo 'user_id' debe ser string";
	if (b.message !== undefined && typeof b.message !== "string") return "Campo 'message' debe ser string";

	return null;
}
