import { Terminal } from "./Terminal";
import { TerminalUI } from "./TerminalUI";
import { CommandService } from "./CommandService";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const ui = new TerminalUI();
    const commandService = new CommandService();
    const terminal = new Terminal(ui, commandService);
    terminal.init();
  } catch (error) {
    console.error("Failed to initialize terminal:", error);
    // Optionally, display a user-friendly error message in the UI
    const body = document.querySelector("body");
    if (body) {
      body.innerHTML = `<div style="color: red; font-family: monospace; padding: 20px;">
                <h1>Fatal Error</h1>
                <p>Could not initialize the terminal. Please check the console for details.</p>
            </div>`;
    }
  }
});
