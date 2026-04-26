export type TaskStatus = "todo" | "pending" | "done";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO
  createdAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To-Do",
  pending: "In Corso",
  done: "Completate",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Bassa",
};
