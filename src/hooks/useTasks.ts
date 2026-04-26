import { useEffect, useState } from "react";
import type { Task, TaskStatus } from "@/types/task";

const STORAGE_KEY = "kanban-tasks-v1";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ]);
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  return { tasks, addTask, updateTask, deleteTask, moveTask };
}
