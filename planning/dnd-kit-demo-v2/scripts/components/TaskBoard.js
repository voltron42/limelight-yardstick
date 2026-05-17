/**
 * Namespace: dndapp.components.TaskBoard
 * Purpose: Task board with jQuery UI drag and drop
 * 
 * Implements:
 * - Drag and drop between columns
 * - Position-based sorting within columns
 * - Visual feedback during drag operations
 * - Column stage management (Ready, In Progress, Done)
 */

namespace('dndapp.components.TaskBoard', {}, () => {
  const columns = [{
    label: "Ready",
    stage: "ready",
    borderColor: "border-success"
  }, {
    label: "In Progress",
    stage: "inProgress",
    borderColor: "border-warning"
  }, {
    label: "Done",
    stage: "done",
    borderColor: "border-danger"
  }];
  
  const colorsByStage = columns.reduce((out, { stage, borderColor }) => {
    out[stage] = borderColor;
    return out;
  }, {});
  
  const cardClasses = "card bg-dark border-2 rounded-2";
  
  return class TaskBoard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tasks: props.tasks || [
          { id: 'task-1', title: 'Design mockups', description: 'Create UI mockups for dashboard', stage: 'ready' },
          { id: 'task-2', title: 'Setup database', description: 'Configure PostgreSQL instance', stage: 'ready' },
          { id: 'task-3', title: 'API development', description: 'Build REST endpoints', stage: 'inProgress' },
          { id: 'task-4', title: 'Testing', description: 'Write unit tests', stage: 'inProgress' },
          { id: 'task-5', title: 'Deployment', description: 'Deploy to staging', stage: 'done' }
        ]
      };
    }
    
    componentDidUpdate() {
      this.initializeDragDrop();
    }
    
    componentDidMount() {
      this.initializeDragDrop();
    }
    
    initializeDragDrop = () => {
      const me = this;
      const dragDropState = {};
      
      // Initialize droppable areas
      $(".droppable").droppable({
        over: (event, { helper }) => {
          const oldColor = dragDropState.id;
          const newStage = event.target.id;
          
          // Update helper styling based on target column
          const classList = helper[0].classList;
          if (oldColor) {
            columns.forEach(col => {
              classList.remove(`ready`);
              classList.remove(`inProgress`);
              classList.remove(`done`);
            });
          }
          classList.add(newStage);
          dragDropState.id = newStage;
        },
        out: (event) => {
          delete dragDropState.id;
        },
        drop: (event, { draggable, position: { top } }) => {
          delete dragDropState.id;
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.remove("drop-target");
          });
          
          const tasks = Array.from(me.state.tasks);
          const dropId = event.target.id;
          
          // Find all tasks currently in the drop column
          const { columnTasks, idIndices } = tasks.reduce(({ columnTasks, idIndices }, task, index) => {
            idIndices[task.id] = index;
            if (task.stage === dropId) {
              columnTasks.push(task.id);
            }
            return { columnTasks, idIndices };
          }, { columnTasks: [], idIndices: {} });
          
          // Calculate positions of tasks in the column
          const taskTops = columnTasks.map((id) => {
            const index = idIndices[id];
            return {
              id,
              index,
              top: document.getElementById(id).offsetTop
            };
          }).sort((a, b) => a.top - b.top);
          
          // Get the dragged task ID
          const taskId = draggable[0].id;
          const existing = taskTops.map(({ id }, index) => ({ id, index })).filter(({ id }) => id === taskId)[0];
          
          // Remove if already in column
          if (existing) {
            taskTops.splice(existing.index, 1);
          }
          
          const taskIndex = idIndices[taskId];
          const newIndex = taskTops.filter((t) => t.top < top).length;
          taskTops.splice(newIndex, 0, { id: taskId, index: taskIndex, top });
          
          // Update task order
          const columnIds = taskTops.reduce((out, { id }) => {
            out[id] = true;
            return out;
          }, {});
          
          const task = tasks[taskIndex];
          task.stage = dropId;
          
          const newTaskOrder = [].concat(
            taskTops.map(({ index }) => tasks[index]),
            tasks.filter(({ id }) => !columnIds[id])
          );
          
          me.setState({ tasks: newTaskOrder });
          
          // Callback to parent if provided
          if (me.props.updateState) {
            me.props.updateState({ tasks: newTaskOrder });
          }
        }
      });
      
      // Initialize draggable items
      $(".draggable").draggable({
        helper: "clone",
        zIndex: 100,
        start: (event, ui) => {
          const draggable = event.target;
          const helper = ui.helper[0];
          helper.style.width = draggable.clientWidth + 'px';
          helper.style.height = draggable.clientHeight + 'px';
        },
        drag: () => {
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.add("drop-target");
          });
        }
      });
    };
    
    clearStage = (stage) => {
      const tasks = Array.from(this.state.tasks).filter((task) => task.stage !== stage);
      this.setState({ tasks });
      
      if (this.props.updateState) {
        this.props.updateState({ tasks });
      }
    };
    
    revertStage = (from, to) => {
      const tasks = Array.from(this.state.tasks).map((task) => {
        if (task.stage === from) {
          task.stage = to;
        }
        return task;
      });
      
      this.setState({ tasks });
      
      if (this.props.updateState) {
        this.props.updateState({ tasks });
      }
    };
    
    deleteTask = (taskId) => {
      const tasks = Array.from(this.state.tasks).filter(task => task.id !== taskId);
      this.setState({ tasks });
      
      if (this.props.updateState) {
        this.props.updateState({ tasks });
      }
    };
    
    render() {
      return (
        <div className="task-board-container">
          {columns.map(({ label, stage, borderColor }) => {
            const stageTasks = this.state.tasks.filter((task) => task.stage === stage);
            
            return (
              <div key={`column-${stage}`} className="board-column">
                <h2>{label}</h2>
                
                <div
                  id={stage}
                  className="droppable"
                >
                  {stageTasks.length > 0 ? (
                    <div>
                      {stageTasks.map((task) => (
                        <div
                          key={`task-${task.id}`}
                          id={task.id}
                          className={`${cardClasses} draggable`}
                        >
                          <div className="card-body">
                            <h5 className="card-title">{task.title}</h5>
                            <p className="card-text">{task.description}</p>
                            <div className="d-flex gap-2">
                              {stage !== 'ready' && (
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => this.revertStage(stage, 'ready')}
                                  title="Move back to Ready"
                                >
                                  <i className="fas fa-arrow-left"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-danger ms-auto"
                                onClick={() => this.deleteTask(task.id)}
                                title="Delete task"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-inbox"></i>
                      <p>No tasks</p>
                    </div>
                  )}
                </div>
                
                {stage === 'done' && stageTasks.length > 0 && (
                  <div className="board-controls">
                    <button
                      className="btn btn-info"
                      onClick={() => this.clearStage(stage)}
                    >
                      <i className="fas fa-check"></i> Clear All
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };
});