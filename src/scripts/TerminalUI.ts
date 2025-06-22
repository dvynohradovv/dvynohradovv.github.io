export class TerminalUI {
  private readonly history: HTMLElement;
  private readonly commandInput: HTMLInputElement;
  private readonly terminalBody: HTMLElement;
  private readonly inputLine: HTMLElement;

  constructor() {
    this.history = document.getElementById("history")!;
    this.commandInput = document.getElementById(
      "command-input",
    ) as HTMLInputElement;
    this.terminalBody = document.getElementById("terminal-body")!;
    this.inputLine = document.getElementById("input-line")!;

    if (
      !this.history ||
      !this.commandInput ||
      !this.terminalBody ||
      !this.inputLine
    ) {
      throw new Error("One or more terminal elements not found in the DOM.");
    }

    this.adjustInputWidth();
  }

  type(
    element: HTMLElement,
    html: string,
    speed: number,
    callback?: () => void,
  ) {
    let i = 0;
    element.innerHTML = "";

    const typing = () => {
      if (i < html.length) {
        const char = html.charAt(i);
        if (char === "<") {
          const endIndex = html.indexOf(">", i);
          if (endIndex !== -1) {
            element.innerHTML += html.substring(i, endIndex + 1);
            i = endIndex + 1;
          } else {
            element.innerHTML += char;
            i++;
          }
        } else {
          element.innerHTML += char;
          i++;
        }
        this.scrollToBottom();
        setTimeout(typing, speed);
      } else if (callback) {
        callback();
      }
    };
    typing();
  }

  typeInPrompt(command: string, speed: number, onComplete: () => void) {
    let i = 0;
    const commandElement = document.createElement("span");
    commandElement.className = "ml-2";

    const promptLine = document.createElement("div");
    promptLine.innerHTML = `<span class="text-green-400">visitor@dvynohradov:~$</span>`;
    promptLine.appendChild(commandElement);
    this.appendToHistory(promptLine);

    const typing = () => {
      if (i < command.length) {
        commandElement.textContent += command.charAt(i);
        i++;
        this.scrollToBottom();
        setTimeout(typing, speed);
      } else {
        onComplete();
      }
    };
    typing();
  }

  showInput() {
    this.inputLine.style.display = "flex";
    this.commandInput.disabled = false;
    this.commandInput.focus();
  }

  hideInput() {
    this.inputLine.style.display = "none";
    this.commandInput.disabled = true;
  }

  clearHistory() {
    this.history.innerHTML = "";
  }

  clearInput() {
    this.commandInput.value = "";
    this.adjustInputWidth();
  }

  appendToHistory(element: HTMLElement) {
    this.history.appendChild(element);
    this.scrollToBottom();
  }

  createOutputElement(): HTMLElement {
    const output = document.createElement("div");
    output.className = "mb-4";
    return output;
  }

  focusInput() {
    this.commandInput.focus();
  }

  adjustInputWidth() {
    const minWidth = 1;
    const newWidth = Math.max(minWidth, this.commandInput.value.length);
    this.commandInput.style.width = `${newWidth}ch`;
  }

  getInputValue(): string {
    return this.commandInput.value.trim().toLowerCase();
  }

  setInputValue(value: string) {
    this.commandInput.value = value;
    this.adjustInputWidth();
  }

  getTerminalBody(): HTMLElement {
    return this.terminalBody;
  }

  getCommandInput(): HTMLInputElement {
    return this.commandInput;
  }

  private scrollToBottom() {
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
  }
}
