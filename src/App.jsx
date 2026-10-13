import { useEffect, useState } from 'react'
import TodoItem from './TodoItem.jsx'
import './App.css'

const STORAGE_KEY = 'todos'

const FILTERS = {
  all: { label: 'Все', test: () => true },
  active: { label: 'Активные', test: (todo) => !todo.done },
  done: { label: 'Выполненные', test: (todo) => todo.done },
}

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // хранилище недоступно (например, приватный режим) — работаем без сохранения
    }
  }, [todos])

  function addTodo(event) {
    event.preventDefault()
    const title = text.trim()
    if (!title) return
    setTodos((prev) => [{ id: crypto.randomUUID(), title, done: false }, ...prev])
    setText('')
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    )
  }

  function renameTodo(id, title) {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, title } : todo)))
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function clearDone() {
    setTodos((prev) => prev.filter((todo) => !todo.done))
  }

  const visibleTodos = todos.filter(FILTERS[filter].test)
  const activeCount = todos.filter((todo) => !todo.done).length
  const doneCount = todos.length - activeCount

  return (
    <main className="app">
      <h1>Список дел</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Что нужно сделать?"
          aria-label="Новая задача"
          autoFocus
        />
        <button type="submit" disabled={!text.trim()}>
          Добавить
        </button>
      </form>

      <div className="filters" role="group" aria-label="Фильтр задач">
        {Object.entries(FILTERS).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={key === filter ? 'filter active' : 'filter'}
            aria-pressed={key === filter}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleTodos.length > 0 ? (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onRename={renameTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      ) : (
        <p className="empty">
          {todos.length === 0 ? 'Задач пока нет — добавьте первую.' : 'Здесь пусто.'}
        </p>
      )}

      {todos.length > 0 && (
        <footer className="summary">
          <span>Осталось: {activeCount}</span>
          <button type="button" className="link" onClick={clearDone} disabled={doneCount === 0}>
            Удалить выполненные
          </button>
        </footer>
      )}
    </main>
  )
}

export default App
