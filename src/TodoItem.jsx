import { useState } from 'react'

function TodoItem({ todo, onToggle, onRename, onDelete }) {
  const [draft, setDraft] = useState(null)
  const editing = draft !== null

  function save() {
    const title = draft.trim()
    if (title) onRename(todo.id, title)
    setDraft(null)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') setDraft(null)
  }

  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Отметить «${todo.title}» выполненной`}
      />

      {editing ? (
        <input
          type="text"
          className="edit"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          aria-label="Редактировать задачу"
          autoFocus
        />
      ) : (
        <span className="title" onDoubleClick={() => setDraft(todo.title)}>
          {todo.title}
        </span>
      )}

      {!editing && (
        <button
          type="button"
          className="icon"
          onClick={() => setDraft(todo.title)}
          aria-label={`Редактировать «${todo.title}»`}
        >
          ✎
        </button>
      )}
      <button
        type="button"
        className="icon danger"
        onClick={() => onDelete(todo.id)}
        aria-label={`Удалить «${todo.title}»`}
      >
        ✕
      </button>
    </li>
  )
}

export default TodoItem
