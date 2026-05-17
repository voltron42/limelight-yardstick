/**
 * Namespace: dndapp.utils.DragDropHelper
 * Purpose: Utility functions for drag and drop operations
 * 
 * Provides helper functions for:
 * - Position calculations
 * - Task sorting
 * - State management
 */

namespace('dndapp.utils.DragDropHelper', {}, () => {
  
  return {
    // Calculate task position within a column
    getTaskPosition: (taskId, columnId) => {
      const element = document.getElementById(taskId);
      if (!element) return null;
      
      return {
        taskId,
        columnId,
        top: element.offsetTop,
        height: element.offsetHeight
      };
    },
    
    // Get all tasks in a column sorted by position
    getColumnTasks: (columnId, tasks) => {
      const columnTasks = tasks.filter(task => task.stage === columnId);
      return columnTasks.sort((a, b) => {
        const aEl = document.getElementById(a.id);
        const bEl = document.getElementById(b.id);
        
        if (!aEl || !bEl) return 0;
        return aEl.offsetTop - bEl.offsetTop;
      });
    },
    
    // Calculate insertion index based on mouse position
    getInsertionIndex: (mouseTop, columnId, taskId, tasks) => {
      const columnTasks = this.getColumnTasks(columnId, tasks);
      const filteredTasks = columnTasks.filter(t => t.id !== taskId);
      
      let index = 0;
      for (const task of filteredTasks) {
        const element = document.getElementById(task.id);
        if (element && element.offsetTop < mouseTop) {
          index++;
        }
      }
      
      return index;
    },
    
    // Reorder tasks array after drop
    reorderTasks: (taskId, fromStage, toStage, insertionIndex, tasks) => {
      const newTasks = Array.from(tasks);
      const taskIndex = newTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) return newTasks;
      
      // Move task to new stage
      const [task] = newTasks.splice(taskIndex, 1);
      task.stage = toStage;
      
      // Insert at correct position
      newTasks.splice(insertionIndex + taskIndex, 0, task);
      
      return newTasks;
    }
  };
});