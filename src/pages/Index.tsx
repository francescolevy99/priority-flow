import { useMemo, useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatus } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

const COLUMNS: { status: TaskStatus; accent: string }[] = [
  { status: "todo", accent: "bg-column-todo" },
  { status: "pending", accent: "bg-column-pending" },
  { status: "done", accent: "bg-column-done" },
];

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const grouped = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      const p = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      if (p !== 0) return p;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    return {
      todo: sorted.filter((t) => t.status === "todo"),
      pending: sorted.filter((t) => t.status === "pending"),
      done: sorted.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  const openNew = (status: TaskStatus = "todo") => {
    setEditing(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  const handleSave = (data: Omit<Task, "id" | "createdAt">) => {
    if (editing) updateTask(editing.id, data);
    else addTask(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Kanban Board</h1>
              <p className="text-sm text-muted-foreground">
                Organizza le tue attività per priorità e scadenza
              </p>
            </div>
          </div>
          <Button onClick={() => openNew("todo")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuova attività
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COLUMNS.map(({ status, accent }) => (
            <KanbanColumn
              key={status}
              status={status}
              title={STATUS_LABELS[status]}
              accentClass={accent}
              tasks={grouped[status]}
              onAdd={openNew}
              onEdit={openEdit}
              onDelete={deleteTask}
              onMove={moveTask}
            />
          ))}
        </div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        defaultStatus={defaultStatus}
        onSave={handleSave}
      />
    </div>
  );
};

export default Index;
