import React, { useState, useEffect } from 'react';
import { TodoListProps, Todo } from '@ce/components/todo/TodoListProps';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = 'http://localhost:3000';

const TodoListEe: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodoTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      setNewTodoTitle('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      setEditingTodoId(null);
      setEditingTitle('');
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleTodo = async (id: number, isCompleted: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <Badge className="mb-4 bg-blue-500">Enterprise Edition</Badge>
      <div className="flex mb-4">
        <Input 
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="New todo title"
          className="mr-2"
        />
        <Button size="sm" onClick={addTodo}>Add Todo</Button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => toggleTodo(todo.id, todo.isCompleted)}
              className="mr-2"
            />
            {editingTodoId === todo.id ? (
              <>
                <Input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Edit todo title"
                  className="mr-2"
                />
                <Button onClick={() => saveEdit(todo.id)} variant="outline" size="sm">Save</Button>
                <Button onClick={() => setEditingTodoId(null)} variant="ghost" size="sm">Cancel</Button>
              </>
            ) : (
              <>
                <span className={todo.isCompleted ? 'line-through' : ''}>{todo.title}</span>
                <Button onClick={() => handleEdit(todo)} variant="outline" size="sm">Edit</Button>
                <Button onClick={() => deleteTodo(todo.id)} variant="destructive" size="sm">Delete</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoListEe;
