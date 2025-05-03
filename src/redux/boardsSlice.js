import { createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

// Helper function to find the active board
const getActiveBoard = (state) => state.find((board) => board.isActive);

const boardsSlice = createSlice({
  name: "boards",
  initialState: data.boards,
  reducers: {
    addBoard: (state, action) => {
      const isActive = state.length === 0;
      state.push({
        name: action.payload.name,
        isActive,
        columns: action.payload.newColumns,
      });
    },
    editBoard: (state, action) => {
      const board = getActiveBoard(state);
      if (board) {
        board.name = action.payload.name;
        board.columns = action.payload.newColumns;
      }
    },
    deleteBoard: (state) => {
      const board = getActiveBoard(state);
      if (board) {
        state.splice(state.indexOf(board), 1);
      }
    },
    setBoardActive: (state, action) => {
      state.forEach((board, index) => {
        board.isActive = index === action.payload.index;
      });
    },
    addTask: (state, action) => {
      const board = getActiveBoard(state);
      if (board) {
        const column = board.columns[action.payload.newColIndex];
        column.tasks.push(action.payload);
      }
    },
    editTask: (state, action) => {
      const { prevColIndex, newColIndex, taskIndex, ...taskData } = action.payload;
      const board = getActiveBoard(state);
      if (board) {
        const prevColumn = board.columns[prevColIndex];
        const task = prevColumn.tasks[taskIndex];
        Object.assign(task, taskData);

        if (prevColIndex !== newColIndex) {
          prevColumn.tasks.splice(taskIndex, 1);
          board.columns[newColIndex].tasks.push(task);
        }
      }
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = getActiveBoard(state);
      if (board) {
        const task = board.columns[prevColIndex].tasks.splice(taskIndex, 1)[0];
        board.columns[colIndex].tasks.push(task);
      }
    },
    setSubtaskCompleted: (state, action) => {
      const { colIndex, taskIndex, index } = action.payload;
      const board = getActiveBoard(state);
      if (board) {
        const subtask = board.columns[colIndex].tasks[taskIndex].subtasks[index];
        subtask.isCompleted = !subtask.isCompleted;
      }
    },
    setTaskStatus: (state, action) => {
      const { colIndex, newColIndex, taskIndex, status } = action.payload;
      const board = getActiveBoard(state);
      if (board && colIndex !== newColIndex) {
        const task = board.columns[colIndex].tasks.splice(taskIndex, 1)[0];
        task.status = status;
        board.columns[newColIndex].tasks.push(task);
      }
    },
    deleteTask: (state, action) => {
      const { colIndex, taskIndex } = action.payload;
      const board = getActiveBoard(state);
      if (board) {
        board.columns[colIndex].tasks.splice(taskIndex, 1);
      }
    },
  },
});

export default boardsSlice;
