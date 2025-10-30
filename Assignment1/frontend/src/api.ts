import type { TaskItem } from './types.ts';

// We get this from the Vite proxy, so we just use a relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Checks if a fetch response is okay, otherwise throws an error.
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText || response.statusText}`);
  }
  // Check for empty content (for 204 No Content responses)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * Fetches all tasks
 */
export const getTasks = async (): Promise<TaskItem[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  return handleResponse(response);
};

/**
 * Adds a new task
 */
export const addTask = async (description: string): Promise<TaskItem> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  return handleResponse(response);
};

/**
 * Toggles a task's completion status
 */
export const toggleTask = async (id: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
  });
  // PUT returns 204 No Content, so we don't expect JSON
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText || response.statusText}`);
  }
  return response;
};

/**
 * Deletes a task
 */
export const deleteTask = async (id: string): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  // DELETE returns 204 No Content
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText || response.statusText}`);
  }
  return response;
};