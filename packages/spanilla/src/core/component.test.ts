import { describe, expect, it, vitest } from "vitest";
import { createComponent } from "./component";
import { html, mount } from "./html";
import { Signal } from "./signal";

describe("component", () => {
  it("renders simple a string", () => {
    const root = document.createElement("div");
    const vNode = html`Hello, World!`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("Hello, World!");
  });

  it("renders markup", () => {
    const root = document.createElement("div");
    const vnode = html`
      <h1>Hello, World!</h1>
      <p>This is a paragraph.</p>
    `;

    mount(root, vnode);

    expect(root.innerHTML).toBe(
      "<h1>Hello, World!</h1><p>This is a paragraph.</p>",
    );
  });

  it("renders a signal", () => {
    const root = document.createElement("div");
    const signal = Signal("Hello, World!");
    const vnode = html`${signal}`;

    mount(root, vnode);

    expect(root.innerHTML).toBe("Hello, World!");

    signal.value = "Goodbye, World!";

    expect(root.innerHTML).toBe("Goodbye, World!");
  });

  it("renders a signal in an attribute", () => {
    const root = document.createElement("div");

    const signal = Signal("Hello, World!");
    const vnode = html`<span title=${signal}></span>`;

    mount(root, vnode);

    expect(root.innerHTML).toBe('<span title="Hello, World!"></span>');

    signal.value = "Goodbye, World!";

    expect(root.innerHTML).toBe('<span title="Goodbye, World!"></span>');
  });

  it("renders nested html templates", () => {
    const root = document.createElement("div");
    const vNode = html`
      <h1>Hello, World!</h1>
      ${html`<p>This is a paragraph.</p>`}
    `;

    mount(root, vNode);

    expect(root.innerHTML).toBe(
      "<h1>Hello, World!</h1><p>This is a paragraph.</p>",
    );
  });

  it("renders a plain function component", () => {
    const Greeting = (props: { name: string }) => {
      return html`<p>Hello, ${props.name}!</p>`;
    };

    const root = document.createElement("div");
    const vNode = html`${Greeting({ name: "World" })}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("<p>Hello, World!</p>");
  });

  it("renders a Counter component", () => {
    const Counter = createComponent(() => {
      const count = Signal(0);

      const increment = () => {
        count.value++;
      };

      return html`
        <p>The count is ${count}</p>
        <button onclick=${increment}>Increment</button>
      `;
    });

    const root = document.createElement("div");

    const vNode = html`${Counter()}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe(
      "<p>The count is 0</p><button>Increment</button>",
    );

    const button = root.querySelector("button");

    button?.dispatchEvent(new MouseEvent("click"));

    expect(root.innerHTML).toBe(
      "<p>The count is 1</p><button>Increment</button>",
    );
  });

  it("renders a Show component", () => {
    const Show = createComponent((props: { show: Signal<boolean> }) => {
      return props.show.value
        ? html`<p>Hello, World!</p>`
        : html`<p>Goodbye, World!</p>`;
    });

    const root = document.createElement("div");
    const show = Signal(true);
    const vNode = html`${Show({ show })}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("<p>Hello, World!</p>");

    show.value = false;

    expect(root.innerHTML).toBe("<p>Goodbye, World!</p>");
  });

  it("renders a component with props", () => {
    const Greeting = createComponent((props: { name: string }) => {
      return html`<p>Hello, ${props.name}!</p>`;
    });

    const root = document.createElement("div");
    const vNode = html`${Greeting({ name: "World" })}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("<p>Hello, World!</p>");
  });

  it("renders a component with props and hooks", () => {
    const Greeting = createComponent((props: { name: string }) => {
      return html`<p>Hello, ${props.name}!</p>`;
    });

    const root = document.createElement("div");
    const onMount = vitest.fn();
    const vNode = html`${Greeting({ name: "World" }).onMount(() =>
      onMount("on mount"),
    )}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("<p>Hello, World!</p>");
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onMount).toHaveBeenCalledWith("on mount");
  });

  it("render a component without props, but with hooks", () => {
    const Greeting = createComponent(() => {
      return html`<p>Hello, World!</p>`;
    });

    const root = document.createElement("div");
    const onMount = vitest.fn();
    const vNode = html`${Greeting().onMount(() => onMount("on mount"))}`;

    mount(root, vNode);

    expect(root.innerHTML).toBe("<p>Hello, World!</p>");
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onMount).toHaveBeenCalledWith("on mount");
  });
});
