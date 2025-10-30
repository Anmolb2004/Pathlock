// This file defines the "shape" of our data

// The 'export' keyword makes this interface available
// to other files that import it.
export interface TaskItem {
  id: string; // The backend sends a Guid, which we treat as a string
  description: string;
  isCompleted: boolean;
}

