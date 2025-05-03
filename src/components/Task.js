import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";

export default function Task({ taskIndex, colIndex }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);

  // Early return AFTER hooks
  if (!board || !board.columns) return null;

  const columns = board.columns;
  const col = columns[colIndex];
  const task = col?.tasks?.[taskIndex];

  if (!task) return null;

  const handleOnDrag = (e) => {
    e.dataTransfer.setData("text", JSON.stringify({ taskIndex, prevColIndex: colIndex }));
  };

  return (
    <div>
      <div
        draggable
        onDragStart={handleOnDrag}
        className="task"
        onClick={() => setIsTaskModalOpen(true)}
      >
        <p className="task-title heading-M">{task.title}</p>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}
