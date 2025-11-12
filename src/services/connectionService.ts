/**
 * Lógica CRUD para la tabla ts_connection en Supabase.
 * - Cada función realiza una sola tarea.
 * - Recibe el SupabaseClient como dependencia para facilitar testing y separación.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConnectionRecord } from "../types";

const TABLE_NAME = "ts_connection";

/**
 * Lista registros ordenados por created_at descendente.
 */
export async function listConnections(supabase: SupabaseClient): Promise<ConnectionRecord[]> {
  const { data, error } = await supabase
    .from<ConnectionRecord>(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Obtiene un registro por id. Retorna null si no existe.
 */
export async function getConnectionById(supabase: SupabaseClient, id: string): Promise<ConnectionRecord | null> {
  const { data, error } = await supabase
    .from<ConnectionRecord>(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

/**
 * Inserta un registro y retorna el registro insertado.
 */
export async function createConnection(
  supabase: SupabaseClient,
  payload: Pick<ConnectionRecord, "type" | "user_id" | "message">
): Promise<ConnectionRecord> {
  const { data, error } = await supabase
    .from<ConnectionRecord>(TABLE_NAME)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza un registro por id y retorna el registro actualizado.
 */
export async function updateConnection(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<Pick<ConnectionRecord, "type" | "user_id" | "message">>
): Promise<ConnectionRecord> {
  const { data, error } = await supabase
    .from<ConnectionRecord>(TABLE_NAME)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina un registro por id y retorna el registro eliminado.
 */
export async function deleteConnection(supabase: SupabaseClient, id: string): Promise<ConnectionRecord> {
  const { data, error } = await supabase
    .from<ConnectionRecord>(TABLE_NAME)
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
