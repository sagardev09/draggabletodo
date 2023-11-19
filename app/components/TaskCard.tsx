"use client";
import React, { useState } from "react";
import { Task, Id } from "../Types";
import Delete from "../icons/Delete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deletetask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deletetask, updateTask }: Props) => {
  const [mouseIsOver, setmouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setmouseIsOver(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50
        bg-slate-600 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative"
      ></div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className=" p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative bg-slate-700 hover:ring-rose-500 hover:ring-2 task"
      >
        <textarea
          name=""
          id=""
          className="h-[90%]
        w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative bg-slate-700 hover:ring-rose-500 hover:ring-2 task taskcardcontainer"
      onMouseEnter={() => {
        setmouseIsOver(true);
      }}
      onMouseLeave={() => {
        setmouseIsOver(false);
      }}
      onClick={toggleEditMode}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap taskcarcontent">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => {
            deletetask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          <Delete />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
