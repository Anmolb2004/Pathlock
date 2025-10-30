// This file defines the "shape" of our data

// A Task, which belongs to a Project
export interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  isCompleted: boolean; // This comes from our DTO
  projectId: string;
}

// A Project, which can have many Tasks
export interface Project {
  id: string;
  title: string;
  description: string | null;
  creationDate: string;
  taskCount: number;
  tasks?: Task[]; // This is optional, loaded on the detail page
}

// User data we get back from the Auth API
export interface User {
  userId: string;
  username: string;
}

// Data we get back from the Auth endpoints
export interface AuthResponse {
  userId: string;
  username: string;
  token: string;
}