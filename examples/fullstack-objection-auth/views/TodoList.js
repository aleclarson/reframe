import React from 'react';
import {endpoints} from 'wildcard-api/client';

function Todo({todo, onCompleteToggle}) {
    return (
      <div>
        <input checked={todo.completed} style={{cursor: 'pointer'}} type="checkbox" onChange={onCompleteToggle}/>
        <span style={{textDecoration: todo.completed&&'line-through'}}>{todo.text}</span>
      </div>
    );
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {todos: props.todos};
    this.addTodo = this.addTodo.bind(this);
  }
  async onCompleteToggle(todo) {
    const todoUpdated = await endpoints.toggleComplete(todo.id);
    this.setState({
      todos: (
        this.state.todos.map(todo => {
          if( todo.id===todoUpdated.id ) {
            return todoUpdated;
          }
          return todo;
        })
      )
    });
  }
  async addTodo(text) {
    const todo = await endpoints.addTodo(text);
    this.setState({
      todos: [
        ...this.state.todos,
        todo,
      ],
    })
  }
  render() {
    return (
      <div>
        <h1>Todos</h1>
        {
          this.state.todos.map(todo =>
            <Todo
              todo={todo}
              key={todo.id}
              onCompleteToggle={() => this.onCompleteToggle(todo)}
            />
          )
        }
        <NewTodo addTodo={this.addTodo} />
      </div>
    );
  }
}


class NewTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange({target: {value}}) {
    this.setState({value});
  }

  async handleKeyPress({key}) {
    if( key==='Enter' ) {
      await this.props.addTodo(this.state.value);
      this.setState({value: ''});
    }
  }

  render() {
    return (
      <div>
        <input
          value={this.state.value}
          placeholder="Type in new todo and press <Enter>"
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          size="30"
        />
      </div>
    );
  }
}

export default TodoList;
