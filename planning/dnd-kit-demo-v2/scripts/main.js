/**
 * Namespace: dndapp.Main
 * Purpose: Main app component (stateful)
 * 
 * Single namespace per file pattern:
 * - This file contains ONLY the Main component
 * - Imports all components as dependencies
 * - Manages app state and orchestration
 * - Class-based component for consistency
 */

namespace('dndapp.Main', {
  'dndapp.components.Header': 'Header',
  'dndapp.components.TaskBoard': 'TaskBoard',
  'dndapp.utils.DragDropHelper': 'DragDropHelper',
}, ({ Header, TaskBoard, DragDropHelper }) => {
  
  return class Main extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        tasks: [
          { id: 'task-1', title: 'Design mockups', description: 'Create UI mockups for dashboard', stage: 'ready' },
          { id: 'task-2', title: 'Setup database', description: 'Configure PostgreSQL instance', stage: 'ready' },
          { id: 'task-3', title: 'API development', description: 'Build REST endpoints', stage: 'inProgress' },
          { id: 'task-4', title: 'Testing', description: 'Write unit tests', stage: 'inProgress' },
          { id: 'task-5', title: 'Deployment', description: 'Deploy to staging', stage: 'done' }
        ]
      };
    }
    
    componentDidMount() {
      console.log('App initialized with tasks:', this.state.tasks);
    }
    
    handleUpdateState = (newState) => {
      this.setState(newState);
      // Save to localStorage if needed
      localStorage.setItem('dndAppState', JSON.stringify(newState));
    };
    
    render() {
      return (
        <div className="app-container">
          <Header />
          <TaskBoard
            tasks={this.state.tasks}
            updateState={this.handleUpdateState}
          />
        </div>
      );
    }
  };
});