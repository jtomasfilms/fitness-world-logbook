"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function ExerciseOptionsMenu(props: {
  onAddNote: () => void;
  onAddSticky: () => void;
  onAddWarmup: () => void;
  onUpdateRest: () => void;
  onReplace: () => void;
  onRemove: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={props.onAddNote}>📝 Add Note</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddSticky}>📌 Add Sticky Note</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddWarmup}>➕ Add Warm-up Sets</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onUpdateRest}>🕒 Update Rest Timers</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.onReplace}>🔁 Replace Exercise</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.onRemove} className="text-red-600">
          ❌ Remove Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
