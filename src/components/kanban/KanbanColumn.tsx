import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

interface Props {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  accentClass: string;
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({ status, title, tasks, accentClass, onAdd, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex h-full min-h-[60vh] flex-col rounded-xl border border-border bg-secondary/40 p-4 transition-colors",
        isOver && "border-primary/40 bg-primary/5"
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", accentClass)} />
          <h2 className="font-semibold text-foreground">{title}</h2>
          <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAdd(status)} aria-label="Aggiungi attività">
          <Plus className="h-4 w-4" />
        </Button>
      </header>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-3">
          {tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              Trascina qui o crea un'attività
            </div>
          ) : (
            tasks.map((t) => <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </div>
      </SortableContext>
    </section>
  );
}
