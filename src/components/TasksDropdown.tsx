import { useState } from 'react';
import { ListTodo, Check, Circle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  locked?: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Buy Enzymes', completed: false },
  { id: '2', title: 'Buy Oocytes', completed: false },
  { id: '3', title: 'Buy $FCBCC', completed: true },
  { id: '4', title: 'Hold DNA of 5 Purebreeds', completed: false },
  { id: '5', title: 'Hold DNA of 10 Purebreeds', completed: false, locked: true },
  { id: '6', title: 'Hold DNA of 25 Purebreeds', completed: false, locked: true },
  { id: '7', title: 'Use a Hint', completed: true },
  { id: '8', title: 'Use 10 Hints', completed: false },
  { id: '9', title: 'Win a Custody', completed: false },
  { id: '10', title: 'Win 10 Custodies', completed: false, locked: true },
  { id: '11', title: 'Unlock All Mystery Boxes', completed: false },
  { id: '12', title: 'Be Top 5 Holder for 10 Purebreeds', completed: false, locked: true },
];

export function TasksDropdown() {
  const [tasks] = useState<Task[]>(initialTasks);
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <ListTodo className="h-4 w-4" />
          {completedCount < totalCount && (
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center">
              {totalCount - completedCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Tasks</span>
          <span className="text-xs font-normal text-muted-foreground">{completedCount}/{totalCount}</span>
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          {tasks.map((task) => (
            <DropdownMenuItem 
              key={task.id} 
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                task.locked && "opacity-50 cursor-not-allowed"
              )}
              disabled={task.locked}
            >
              {task.locked ? (
                <Lock className="h-3 w-3 text-muted-foreground" />
              ) : task.completed ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground" />
              )}
              <span className={cn(
                "text-xs",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
