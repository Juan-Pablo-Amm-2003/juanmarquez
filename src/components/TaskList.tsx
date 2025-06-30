import React, { useEffect, useState } from 'react';
import { SupabaseTask } from '../types/task';

interface TaskListProps {
  refreshSignal: number;
}

const TaskList: React.FC<TaskListProps> = ({ refreshSignal }) => {
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshSignal]);

  if (loading) {
    return <p className="mt-8">Loading tasks...</p>;
  }

  if (error) {
    return (
      <p className="mt-8 text-red-600">Error fetching tasks: {error}</p>
    );
  }

  if (tasks.length === 0) {
    return <p className="mt-8">No tasks found.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Latest Tasks</h3>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Progreso</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id_tarea} className="border-t">
              <td className="px-4 py-2">{task.id_tarea}</td>
              <td className="px-4 py-2">{task.nombre_tarea}</td>
              <td className="px-4 py-2">{task.progreso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
