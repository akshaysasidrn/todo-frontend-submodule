import React, { useState } from 'react';
import TodoListCe from '@ce/components/TodoListCe';
import { Todo } from '@ce/components/TodoListProps'; 

const API_BASE_URL = 'http://localhost:3000';

const TodoListEE: React.FC = () => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PATCH',
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
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div>
      <h1>Todo List (Enterprise Edition)</h1>
      <TodoListCe />
      <ul>
        {editingTodoId && (
          <li>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              placeholder="Edit todo title"
            />
            <button onClick={() => saveEdit(editingTodoId)}>Save</button>
            <button onClick={() => setEditingTodoId(null)}>Cancel</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default TodoListEE;
