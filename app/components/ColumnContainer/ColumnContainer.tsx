"use client";
import { useState, useMemo } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { Id, column, Task } from "../../Types";
import Delete from "../../icons/Delete";
import { CSS } from "@dnd-kit/utilities";
import Plus from "../../icons/Plus";
import TaskCard from "../TaskCard";
import Pc from "../../icons/Pc";

interface Props {
  Column: column;
  DeleteTask: (id: Id) => void;
  updateColumn: (id: Id, title: String) => void;
  createTask: (columnId: Id) => void;
  deletetask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return props.tasks.map((task) => task.id);
  }, [props.tasks]);

  const {
    Column,
    DeleteTask,
    updateColumn,
    createTask,
    tasks,
    deletetask,
    updateTask,
  } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: Column.id,
    data: {
      type: "Column",
      Column,
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
        className="bg-gray-600 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-600 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* //column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-slate-700
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      border-gray-600
      border-4
      flex
      items-center
      justify-between"
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-slate-700 px-2 py-1 text-sm rounded-full">
            <Pc />
          </div>
          {!editMode && Column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-400 border rounded-md outline-none px-2"
              autoFocus
              value={Column.title}
              onChange={(e) => {
                updateColumn(Column.id, e.target.value);
              }}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") {
                  return;
                }
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button className="" onClick={() => DeleteTask(Column.id)}>
          <Delete />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-1 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deletetask={deletetask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      <button
        className="flex items-center justify-center gap-3 bg-rose-400 p-[12px] border-2 rounded-md text-white font-normal capitalize"
        onClick={() => {
          createTask(Column.id);
        }}
      >
        <Plus />
        Add a task
      </button>
    </div>
  );
};

export default ColumnContainer;
