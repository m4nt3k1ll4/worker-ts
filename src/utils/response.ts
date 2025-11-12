/**
 * Helpers para respuestas HTTP JSON estructuradas.
 * - jsonResponse: retorna un Response con {status, message, data?}
 */

export type ApiResponse<T = unknown> = {
	status: "success" | "error";
	message: string;
	data?: T;
};

export function jsonResponse<T = unknown>(payload: ApiResponse<T>, statusCode = 200, extraHeaders: Record<string, string> = {}): Response {
	const baseHeaders: Record<string, string> = {
		"Content-Type": "application/json;charset=UTF-8",
		"Access-Control-Allow-Origin": "*", // Para pruebas; en producción restringir.
		"Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	};

	const headers = { ...baseHeaders, ...extraHeaders };
	return new Response(JSON.stringify(payload), { status: statusCode, headers });
}
