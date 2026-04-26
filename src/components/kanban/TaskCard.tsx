import { Calendar, Pencil, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";
import { PRIORITY_LABELS } from "@/types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
}

const priorityStyles: Record<Task["priority"], string> = {
  high: "bg-priority-high-bg text-priority-high border-priority-high/20",
  medium: "bg-priority-medium-bg text-priority-medium border-priority-medium/20",
  low: "bg-priority-low-bg text-priority-low border-priority-low/20",
};

const priorityBar: Record<Task["priority"], string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}

function dueState(iso: string, status: TaskStatus) {
  if (status === "done") return "neutral";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const diff = (due.getTime() - today.getTime()) / 86400000;
  if (diff < 0) return "overdue";
  if (diff <= 2) return "soon";
  return "neutral";
}

export function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const due = dueState(task.dueDate, task.status);
  const prevStatus: TaskStatus | null =
    task.status === "pending" ? "todo" : task.status === "done" ? "pending" : null;
  const nextStatus: TaskStatus | null =
    task.status === "todo" ? "pending" : task.status === "pending" ? "done" : null;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      <div className={cn("absolute left-0 top-0 h-full w-1", priorityBar[task.priority])} />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-medium leading-snug text-card-foreground",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          <Badge variant="outline" className={cn("shrink-0 text-xs font-medium", priorityStyles[task.priority])}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span
            className={cn(
              "font-medium",
              due === "overdue" && "text-priority-high",
              due === "soon" && "text-priority-medium",
              due === "neutral" && "text-muted-foreground"
            )}
          >
            {formatDate(task.dueDate)}
            {due === "overdue" && " · in ritardo"}
            {due === "soon" && " · in scadenza"}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex gap-1">
            {prevStatus && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onMove(task.id, prevStatus)}
                aria-label="Sposta indietro"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            )}
            {nextStatus && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onMove(task.id, nextStatus)}
                aria-label="Sposta avanti"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(task)} aria-label="Modifica">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-priority-high hover:text-priority-high"
              onClick={() => onDelete(task.id)}
              aria-label="Elimina"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
