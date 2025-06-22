import { TerminalUI } from "./TerminalUI";
import { CommandService } from "./CommandService";

export class Terminal {
  private commandHistory: string[] = [];
  private historyIndex = 0;
  private suggestions: string[] = [];
  private suggestionIndex = 0;

  constructor(
    private readonly ui: TerminalUI,
    private readonly commandService: CommandService,
  ) {}

  public init() {
    this.setupEventListeners();
    this.runInitialSequence();
  }

  private setupEventListeners() {
    this.ui
      .getCommandInput()
      .addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.ui
      .getCommandInput()
      .addEventListener("input", () => this.ui.adjustInputWidth());
    this.ui
      .getTerminalBody()
      .addEventListener("click", () => this.ui.focusInput());
  }

  private runCommand(
    commandName: string,
    options?: { onComplete?: () => void; suppressCommand?: boolean },
  ) {
    const { onComplete, suppressCommand = false } = options || {};
    const outputElement = this.ui.createOutputElement();

    if (!suppressCommand) {
      const commandElement = document.createElement("div");
      commandElement.innerHTML = `<span class="text-green-400">visitor@dvynohradov:~$</span><span class="ml-2">${commandName}</span>`;
      this.ui.appendToHistory(commandElement);
      this.commandHistory.push(commandName);
      this.historyIndex = this.commandHistory.length;
    }

    if (commandName === "clear") {
      this.ui.clearHistory();
      if (onComplete) onComplete();
      return;
    }

    const result = this.commandService.executeCommand(commandName);
    this.ui.appendToHistory(outputElement);
    this.ui.type(outputElement, result, 15, onComplete);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const isSuggestionKey = e.key === "Tab";
    const isHistoryKey = e.key === "ArrowUp" || e.key === "ArrowDown";

    if (!isSuggestionKey && !isHistoryKey) {
      this.suggestions = [];
      this.suggestionIndex = 0;
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        const command = this.ui.getInputValue();
        if (command) {
          this.runCommand(command);
        }
        this.ui.clearInput();
        break;

      case "Tab":
        e.preventDefault();
        this.handleTabCompletion();
        break;

      case "ArrowUp":
        e.preventDefault();
        this.navigateHistory(1);
        break;

      case "ArrowDown":
        e.preventDefault();
        this.navigateHistory(-1);
        break;
    }
  }

  private navigateHistory(direction: number) {
    if (direction > 0) {
      // Up
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.ui.setInputValue(this.commandHistory[this.historyIndex]);
      }
    } else {
      // Down
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.ui.setInputValue(this.commandHistory[this.historyIndex]);
      } else {
        this.historyIndex = this.commandHistory.length;
        this.ui.clearInput();
      }
    }
  }

  private handleTabCompletion() {
    const currentInput = this.ui.getInputValue();
    if (this.suggestions.length === 0) {
      this.suggestions = this.commandService
        .getCommandNames()
        .filter((cmd) => cmd.startsWith(currentInput));
      this.suggestionIndex = 0;
    }

    if (this.suggestions.length > 0) {
      this.ui.setInputValue(this.suggestions[this.suggestionIndex]);
      this.suggestionIndex =
        (this.suggestionIndex + 1) % this.suggestions.length;
    }
  }

  private runInitialSequence() {
    this.ui.hideInput();

    const welcomeElement = this.ui.createOutputElement();
    this.ui.appendToHistory(welcomeElement);

    this.ui.type(
      welcomeElement,
      `<p>Welcome to my interactive portfolio.</p>`,
      15,
      () => {
        const loadingLine = document.createElement("div");
        loadingLine.innerHTML = `<span class="text-green-400">visitor@dvynohradov:~$</span> `;
        this.ui.appendToHistory(loadingLine);

        const loadingTextElement = document.createElement("span");
        loadingTextElement.className = "ml-2";
        loadingLine.appendChild(loadingTextElement);

        this.ui.type(loadingTextElement, `Loading profile...`, 15, () => {
          setTimeout(() => {
            this.ui.clearHistory();
            // this.runAbout();
            this.runContact();
          }, 3000);
        });
      },
    );
  }

  private runAbout = () => {
    this.ui.typeInPrompt("about", 250, () => {
      this.runCommand("about", {
        suppressCommand: true,
        onComplete: this.runSkills,
      });
    });
  };

  private runSkills = () => {
    this.ui.typeInPrompt("skills", 250, () => {
      this.runCommand("skills", {
        suppressCommand: true,
        onComplete: this.runContact,
      });
    });
  };

  private runContact = () => {
    this.ui.typeInPrompt("contact", 250, () => {
      this.runCommand("contact", {
        suppressCommand: true,
        onComplete: this.finalize,
      });
    });
  };

  private finalize = () => {
    const hint = this.ui.createOutputElement();
    this.ui.appendToHistory(hint);
    this.ui.type(
      hint,
      `<p class="mt-4">Type <span class="text-green-400">'help'</span> to see all available commands.</p>`,
      15,
      () => {
        this.ui.showInput();
      },
    );
  };
}
