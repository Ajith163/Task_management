import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";

export default function AddEditTaskModal({
  type,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [isValid, setIsValid] = useState(true);

  const board = useSelector((state) => state.boards).find((b) => b.isActive);
  const columns = board.columns;

  useEffect(() => {
    if (type === "edit") {
      const task = columns[prevColIndex]?.tasks[taskIndex];
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        const index = columns.findIndex((col) => col.name === task.status);
        setNewColIndex(index !== -1 ? index : 0);
      }
    } else {
      setStatus(columns[prevColIndex]?.name || "");
    }
  }, [type, columns, prevColIndex, taskIndex]);

  const validate = () => {
    if (!title.trim()) {
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onSubmit = () => {
    if (!validate()) return;

    const taskPayload = {
      title,
      description,
      status,
      newColIndex,
    };

    if (type === "add") {
      dispatch(boardsSlice.actions.addTask(taskPayload));
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          ...taskPayload,
          taskIndex,
          prevColIndex,
        })
      );
    }

    setIsAddTaskModalOpen(false);
    if (type === "edit") setIsTaskModalOpen(false);
  };

  return (
    <div
      className={`modal-container ${type === "add" ? "dimmed" : ""}`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setIsAddTaskModalOpen(false);
      }}
    >
      <div className="modal">
        <h3>{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <label htmlFor="task-name-input">Task Name</label>
        <div className="input-container">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            placeholder="e.g. Take coffee break"
            className={!isValid ? "red-border" : ""}
          />
          {!isValid && (
            <span className="cant-be-empty-span text-L">Can't be empty</span>
          )}
        </div>

        <label htmlFor="task-description-input">Description</label>
        <div className="description-container">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            placeholder="e.g. Take a 15 minute break to recharge."
          />
        </div>

        <div className="select-column-container">
          <label className="text-M">Current Status</label>
          <select
            className="select-status text-L"
            value={status}
            onChange={onChangeStatus}
          >
            {columns.map((col, index) => (
              <option key={index} className="status-options">
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={onSubmit} className="create-btn">
          {type === "edit" ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </div>
  );
}
