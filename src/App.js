import React from 'react';
import { faEdit,faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './App.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditModeOn:false,
      tasks: [],
      currentTask:{
          text:'',
          key:''
        },
      bucketList:[],
      selectedLabel:'',
      createNewBucket:false,
      newBucket:''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.optionChange = this.optionChange.bind(this);
    this.handleCreateBucket = this.handleCreateBucket.bind(this);
    this.saveBucket = this.saveBucket.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {tasks,currentTask,selectedLabel} = this.state;
    const existingTask= tasks.filter(item =>
      item.key === currentTask.key);  
    /*to update a existing task */
    if(existingTask.length > 0){
      const updatedtasks = [...tasks];
      var existingTaskIndex = updatedtasks.findIndex(x => x.key === currentTask.key);
      updatedtasks[existingTaskIndex] = currentTask;
      updatedtasks[existingTaskIndex].isDone = false;
      updatedtasks[existingTaskIndex].label = selectedLabel;
      this.setState({
        isEditModeOn:false,
        tasks: updatedtasks,
        currentTask:{
          text:'',
          key:''
        }
      })
    }
    /*to create a new task */
    else{
      const newTask = currentTask;
      newTask.label = selectedLabel;
      if(newTask.text !==""){
        const updatedTasks = [...tasks, newTask];
      this.setState({
        isEditModeOn:false,
        tasks: updatedTasks,
        currentTask:{
          text:'',
          key:''
        }
      })
      }
    } 
  }
  
  handleDelete = (key) => {
    const filteredTasks= this.state.tasks.filter(item =>
      item.key!==key);
    this.setState({
  tasks: filteredTasks
    })
  }

  handleEdit = (key) => {
    const {tasks} = this.state;
    const filteredTasks= tasks.filter(item =>
      item.key ===key);
    this.setState({
      isEditModeOn:true,
      currentTask:filteredTasks[0],
      selectedLabel:filteredTasks[0].label
    })
  }

  handleCheckboxChange = (key,e) =>{
      const tasks = [...this.state.tasks];
      var taskIndex = tasks.findIndex(x => x.key === key);
      tasks[taskIndex].isDone = e.target.checked ? true :false;
      this.setState({
        tasks: tasks
      })
  }

  handleChange(e) {
    const {currentTask} = this.state;
      this.setState({
        currentTask:{
          text: e.target.value,
          key: currentTask.key !== '' ? currentTask.key : Date.now()
        }
      })
  }

  handleInput(e){
    e.preventDefault();
    this.setState({
      currentTask:{
        text: e.target.value,
        key: Date.now()
      }
    })
  }

  optionChange(e){
    this.setState({selectedLabel: e.target.value});
  }

  handleCreateBucket(){
    this.setState({createNewBucket: true});
  }

  saveBucket(){
    const newBucketList = [...this.state.bucketList, this.state.newBucket];
    this.setState({
      bucketList: newBucketList,
      newBucket:''});
  }

  handleNewBucketNameChange(e){
    e.preventDefault();
    this.setState({
      newBucket:e.target.value
    })
  }

  render() {
    const {currentTask,selectedLabel,bucketList, isEditModeOn,newBucket,tasks} = this.state
    return(
      <div className='wrapper'>
        <div className="container">
        <h1>My Todo List </h1>
        <div className='myForm'>
        <input type="text" placeholder='Enter task....' value={currentTask.text} onChange={this.handleChange} />
        <label htmlFor="labels">Choose a bucket:</label>
        <select id="labels" onChange={this.optionChange} value={selectedLabel}>
        <option key= 'select' value= 'Select'>Select</option>
        {bucketList.map((option) => {
            return <option key= {option} value={option}>{option}</option>
        })
        }
        </select>
        <button className='button' disabled={currentTask.text.length < 1}
         onClick={this.handleSubmit}>{isEditModeOn ? 'Update Task' : 'Add Task'}
         </button>
        </div>
      <div className="bucketlist">
      <h5> <i>My buckets - {bucketList.length} </i></h5>
      {bucketList.map((option) => {
  return <li key={option}>{option}</li>
})
}
<input type="text" placeholder='Enter new bucket....' value={newBucket} onChange={ (e) => this.handleNewBucketNameChange(e)} />
<button className='button' disabled={newBucket.length < 1} onClick={this.saveBucket}>Create Bucket</button>
    </div>
          <div className='my-task-list'>
          <h3>Total Tasks - {tasks.length}</h3>
          <TodoList tasks={tasks} onDelete={this.handleDelete}
          onEdit={this.handleEdit} 
          onCheckboxChange={this.handleCheckboxChange}/>
          </div>
          
        </div>
      </div>
    );
  } 
}


const TodoList = (props) => {
  const todos = props.tasks.map((todo) => {
    return <TodoItem  key={todo.key} task={todo} onDelete={props.onDelete}
    onEdit={props.onEdit} 
    onCheckboxChange={props.onCheckboxChange} 
    />
  })
  return( 
    <div className='list-wrapper'>
      {todos}
    </div>
  );
}

const TodoItem = (props) => {
  return(
    <div key={props.task.key} className={`list-item ${props.task.isDone ? 'completed-task': ''}`}>
      <div className='action-buttons'>
      <input type="checkbox" checked={props.task.isDone} id={props.task.key} name={props.task.key} value={props.task.text}
         onChange={(e) => {props.onCheckboxChange(props.task.key,e)}}/>
        <FontAwesomeIcon icon={faEdit} onClick={() => {props.onEdit(props.task.key)}}/>
        <FontAwesomeIcon icon={faTrash} onClick={() => {props.onDelete(props.task.key)}}/>
      </div>
        
        <h5> {props.task.text}</h5>
        {(props.task.label === 'Select' || props.task.label.length < 1) ? <h6><i>No bucket assigned</i></h6> : 
        <h6 className="bucket-label"> {props.task.label}</h6>
        }        
    </div>
  );
}

export default App;
