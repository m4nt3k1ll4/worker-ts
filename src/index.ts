// src/index.ts
/**
 * Entry point del Worker. Enruta peticiones hacia el handler de connections.
 * - Mantén este archivo mínimo: solo importa el handler y re-exporta el fetch.
 */

import { handleConnectionsRequest } from "./handlers/connectionHandler";
import type { Env } from "./types";

/**
 * Export default handler compatible con Workers (ES Modules).
 * Delegamos toda la lógica a handlers para mantener responsabilidad única.
 */
export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handleConnectionsRequest(request, env);
	},
} as ExportedHandler<Env>;
