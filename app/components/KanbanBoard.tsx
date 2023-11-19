"use client";
import React, { useMemo, useState } from "react";
import Plus from "../icons/Plus";
import { column, Id, Task } from "../Types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setcolumns] = useState<column[]>([]);
  const columnsId = useMemo(() => columns.map((item) => item.id), [columns]);
  const [activecolumn, setactivecolumn] = useState<column | null>(null);
  const [activeTask, setactiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  function createNewColumn() {
    const columnToAdd: column = {
      id: generateId(),
      title: `column ${columns.length + 1}`,
    };
    setcolumns([...columns, columnToAdd]);
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }
  //column delete function
  function DeleteTask(id: Id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setcolumns(filteredColumn);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }
  //task delete function
  function deletetask(id: Id) {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  }

  function updateTask(id: Id, content: String) {
    const UpdatedTask = tasks.map((task) => {
      if (task.id !== id) {
        return task;
      }
      return { ...task, content };
    });
    setTasks(UpdatedTask);
  }

  function updateColumn(id: Id, title: String) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) {
        return col;
      }
      return { ...col, title };
    });
    setcolumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setactivecolumn(event.active.data.current.Column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setactiveTask(event.active.data.current.task);
      return;
    }
  }
  function OnDragEnd(event: DragEndEvent) {
    setactiveTask(null);
    setactivecolumn(null);
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeColumnid = active.id;
    const overColumnid = over.id;

    if (activeColumnid === overColumnid) {
      return;
    }
    setcolumns((columns) => {
      const activeColumnsIdex = columns.findIndex(
        (col) => col.id === activeColumnid
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnid
      );
      return arrayMove(columns, activeColumnsIdex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const activeColumnid = active.id;
    const overColumnid = over.id;
    if (activeColumnid === overColumnid) {
      return;
    }

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    //dropping a task over another task

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex(
          (task) => task.id === activeColumnid
        );
        const overIndex = tasks.findIndex((task) => task.id === overColumnid);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnid);

        tasks[activeIndex].columnId = overColumnid;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={OnDragEnd}
        sensors={sensors}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex items-end gap-6">
          <div className="flex gap-2">
            <SortableContext items={columnsId}>
              {columns.map((item, index) => {
                return (
                  <ColumnContainer
                    key={item.id}
                    Column={item}
                    DeleteTask={DeleteTask}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === item.id)}
                    deletetask={deletetask}
                    updateTask={updateTask}
                  />
                );
              })}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className="h-[60px] w-[360px] min-w-[360px] bg-gray-700 p-4 border-slate-500 border-2 ring-rose-600 opacity-80 rounded-lg hover:ring-2 flex items-start justify-center gap-3 fixed top-[50px] right-[50px]"
          >
            <Plus />
            add column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activecolumn && (
              <ColumnContainer
                Column={activecolumn}
                DeleteTask={DeleteTask}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activecolumn.id
                )}
                deletetask={deletetask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deletetask={deletetask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
