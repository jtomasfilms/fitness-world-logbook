"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function WorkoutOptionsMenu(props: {
  onRename: () => void;
  onTimeEdit: () => void;
  onAddPhoto: () => void;
  onAddNote: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="h-9 w-9">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={props.onRename}>✏️ Edit Workout Name</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onTimeEdit}>🕒 Adjust Start/End Time</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.onAddPhoto}>🖼️ Add Photo</DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddNote}>📝 Add Note</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
