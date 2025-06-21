document.addEventListener("DOMContentLoaded", () => {
  const history = document.getElementById("history");
  const commandInput = document.getElementById(
    "command-input",
  ) as HTMLInputElement;
  const terminalBody = document.getElementById("terminal-body");

  if (!history || !commandInput || !terminalBody) {
    return;
  }

  const commandHistory: string[] = [];
  let historyIndex = 0;
  let suggestions: string[] = [];
  let suggestionIndex = 0;

  const runCommand = (command: keyof typeof commands) => {
    const commandElement = document.createElement("div");
    commandElement.innerHTML = `<span class="text-green-400">visitor@dvynohradov:~$</span><span class="ml-2">${command}</span>`;
    history.appendChild(commandElement);

    if (command) {
      commandHistory.push(command);
      historyIndex = commandHistory.length;

      if (command === "clear") {
        history.innerHTML = "";
      } else if (commands[command]) {
        const output = document.createElement("div");
        output.className = "mb-4";
        history.appendChild(output);
        const result =
          typeof commands[command] === "function"
            ? (commands[command] as () => string)()
            : (commands[command] as string);
        type(output, result);
      } else {
        const output = document.createElement("div");
        output.className = "mb-4";
        history.appendChild(output);
        type(output, `bash: command not found: ${command}`);
      }
    }
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  const commands = {
    clear: "",
    help: `
      <p>Available commands:</p>
      <ul class="list-inside list-disc">
        <li><span class="text-green-400">about</span> - Who I am</li>
        <li><span class="text-green-400">skills</span> - My technical skills</li>
        <li><span class="text-green-400">experience</span> - My work experience</li>
        <li><span class="text-green-400">projects</span> - Some of my projects</li>
        <li><span class="text-green-400">contact</span> - How to reach me</li>
        <li><span class="text-green-400">date</span> - Display the current date</li>
        <li><span class="text-green-400">clear</span> - Clear the terminal screen</li>
      </ul>
    `,
    about:
      "<p>My name is Dmytro Vynohradov. I am a passionate developer who loves building things for the web. I specialize in creating modern, responsive, and user-friendly applications.</p>",
    skills: `
      <p>My skills include:</p>
      <ul class="list-inside list-disc">
        <li>JavaScript (ES6+) & TypeScript</li>
        <li>React & Next.js</li>
        <li>Astro</li>
        <li>Node.js</li>
        <li>Tailwind CSS</li>
        <li>Git & GitHub</li>
      </ul>
    `,
    experience: `
      <div>
        <p class="font-bold">Senior Developer at TechCorp (2022 - Present)</p>
        <p class="pl-4">- Led the development of a new e-commerce platform, improving performance by 30%.</p>
        <p class="pl-4">- Mentored junior developers and conducted code reviews.</p>
      </div>
      <div class="mt-2">
        <p class="font-bold">Junior Developer at WebSolutions (2020 - 2022)</p>
        <p class="pl-4">- Built and maintained client websites using modern web technologies.</p>
      </div>
    `,
    projects: `
      <p>Some of my projects:</p>
      <ul class="list-inside list-disc">
        <li><a href="#" target="_blank" class="text-blue-400 underline">Project One</a> - A brief description of this awesome project.</li>
        <li><a href="#" target="_blank" class="text-blue-400 underline">Project Two</a> - Another cool project that showcases my skills.</li>
      </ul>
    `,
    contact: `
      <p>You can reach me at:</p>
      <ul class="list-inside list-disc">
        <li>Email: <a href="mailto:your.email@example.com" class="text-blue-400 underline">your.email@example.com</a></li>
        <li>LinkedIn: <a href="#" target="_blank" class="text-blue-400 underline">linkedin.com/in/yourprofile</a></li>
        <li>GitHub: <a href="#" target="_blank" class="text-blue-400 underline">github.com/yourusername</a></li>
      </ul>
    `,
    date: () => new Date().toDateString(),
  };

  const type = (element: HTMLElement, html: string, callback?: () => void) => {
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
        terminalBody.scrollTop = terminalBody.scrollHeight;
        setTimeout(typing, 10);
      } else if (callback) {
        callback();
      }
    };
    typing();
  };

  commandInput.addEventListener("keydown", (e) => {
    const isSuggestionKey = e.key === "Tab";
    const isHistoryKey = e.key === "ArrowUp" || e.key === "ArrowDown";

    if (!isSuggestionKey && !isHistoryKey) {
      suggestions = [];
      suggestionIndex = 0;
    }

    if (isSuggestionKey) {
      e.preventDefault();
      const currentInput = commandInput.value.toLowerCase();

      if (suggestions.length === 0) {
        suggestions = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(currentInput),
        );
        suggestionIndex = 0;
      }

      if (suggestions.length > 0) {
        commandInput.value = suggestions[suggestionIndex];
        suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        commandInput.dispatchEvent(new Event("input"));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const command = commandInput.value
        .trim()
        .toLowerCase() as keyof typeof commands;

      runCommand(command);

      commandInput.value = "";
      commandInput.dispatchEvent(new Event("input"));
      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex];
        commandInput.dispatchEvent(new Event("input"));
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex];
        commandInput.dispatchEvent(new Event("input"));
      } else {
        historyIndex = commandHistory.length;
        commandInput.value = "";
        commandInput.dispatchEvent(new Event("input"));
      }
    }
  });

  commandInput.addEventListener("input", () => {
    const minWidth = 1;
    const newWidth = Math.max(minWidth, commandInput.value.length);
    commandInput.style.width = `${newWidth}ch`;
  });

  commandInput.style.width = "1ch";

  terminalBody.addEventListener("click", () => {
    commandInput.focus();
  });

  runCommand("about");
});
