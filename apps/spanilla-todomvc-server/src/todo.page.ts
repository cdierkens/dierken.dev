import { html } from "@dierkens.dev/spanilla";
import { layout } from "./layout.template";

export interface Todo {
  id: string;
  label: string;
  completed: boolean;
}

const links = [
  {
    label: "All",
    href: "/",
  },
  {
    label: "Active",
    href: "/active",
  },
  {
    label: "Completed",
    href: "/completed",
  },
];

export function todoPage(
  todos: Todo[],
  filter: (todo: Todo) => boolean,
  url: string,
) {
  return layout(html`
    <section class="todoapp">
      <header class="header">
        <h1 class="todo">todos</h1>

        <form method="POST">
          <input type="hidden" name="action" value="add" />
          <input
            id="new-todo"
            name="label"
            class="new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      <main class="main">
        <div class="toggle-all-container">
          <form method="POST">
            <input type="hidden" name="action" value="complete-all" />
            <input
              class="toggle-all"
              id="toggle-all"
              type="checkbox"
              onchange="this.form.submit()"
              checked="${todos.some((todo) => !todo.completed)}"
            />
            <label class="toggle-all-label" for="toggle-all"
              >Mark all as complete</label
            >
          </form>
        </div>
        <ul class="todo-list">
          ${todos.filter(filter).map((todo, index) => {
            return html`
              <li class="todo-item">
                <div class="view">
                  <form method="POST">
                    <input type="hidden" name="action" value="toggle" />
                    <input type="hidden" name="id" value="${todo.id}" />
                    <input
                      class="toggle"
                      id="todo-${index}"
                      type="checkbox"
                      checked="${todo.completed}"
                      onchange="this.form.submit()"
                    />
                    <label for="todo-${index}">${todo.label}</label>
                  </form>
                  <form method="POST">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value="${todo.id}" />
                    <button type="submit" class="destroy"></button>
                  </form>
                </div>
                <input class="edit" value="${todo.label}" />
              </li>
            `;
          })}
        </ul>
      </main>

      <footer class="footer">
        <span class="todo-count">
          ${todos.filter((todo) => !todo.completed).length} items left
        </span>
        <ul class="filters">
          ${links.map((link) => {
            return html`
              <li>
                <a
                  href="${link.href}"
                  class="${url === link.href ? "selected" : ""}"
                  >${link.label}</a
                >
              </li>
            `;
          })}
        </ul>
        <form method="POST">
          <input type="hidden" name="action" value="clear-completed" />

          <button type="submit" class="clear-completed">Clear completed</button>
        </form>
      </footer>
    </section>
  `);
}