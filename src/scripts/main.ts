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
        <li><span class="text-green-400">philosophy</span> - My development philosophy</li>
        <li><span class="text-green-400">contact</span> - How to reach me</li>
        <li><span class="text-green-400">date</span> - Display the current date</li>
        <li><span class="text-green-400">clear</span> - Clear the terminal screen</li>
      </ul>
    `,
    about:
      "<p>I'm a Full-Stack Software Engineer who thrives on building complex, mission-critical systems. 🚀 Currently, I'm engineering the core platform that powers the law-making process for U.S. state governments. I handle the full stack, from Python backend services (Django, GraphQL) to React-based web apps and even some C#/.NET plugins for Microsoft Office. It's pretty cool stuff! (⌐■_■)</p>",
    skills: `
      <p>Here's my tech toolbox 🧰:</p>
      <ul class="list-inside list-disc">
        <li><strong>Backend:</strong> Python (Django, GraphQL), Node.js</li>
        <li><strong>Frontend:</strong> React, Next.js, JavaScript (ES6+), TypeScript, Astro, Tailwind CSS</li>
        <li><strong>Desktop:</strong> C#/.NET (for MS Office plugins)</li>
        <li><strong>Databases:</strong> PostgreSQL, Elasticsearch, Redis</li>
        <li><strong>DevOps:</strong> Docker, CI/CD</li>
        <li><strong>Methodologies:</strong> SOLID, Clean Code</li>
        <li><strong>Version Control:</strong> Git & GitHub</li>
      </ul>
    `,
    experience: `
      <p>I've ventured through diverse domains like fintech, where I automated financial data processing, and B2B compliance platforms. 🏦 My experience has taught me that robust systems are built on a solid foundation. I'm all about that clean, maintainable code (SOLID principles!), fully automated CI/CD pipelines with Docker, and using the right data tools for the job, like PostgreSQL, Elasticsearch, and Redis. 🛠️</p>
    `,
    philosophy: `
      <p>I'm a firm believer that the best products come from strong, collaborative teams. 🤝 I love participating in code reviews, sharing knowledge, and mentoring junior developers. I think a team's collective growth is the secret sauce to an amazing final product. I'm on the lookout for a new challenge where I can tackle tough technical problems in a place that values engineering excellence. ✨ Let's build something great together! (づ｡◕‿‿◕｡)づ</p>
    `,
    contact: `
      <p>You can reach me at:</p>
      <ul class="list-inside list-disc">
        <li>Email: <a href="mailto:dvynohradovv@proton.me" class="text-blue-400 underline">dvynohradovv@proton.me</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/dvynohradov/" target="_blank" class="text-blue-400 underline">https://www.linkedin.com/in/dvynohradov/</a></li>
        <li>GitHub: <a href="https://github.com/dvynohradov" target="_blank" class="text-blue-400 underline">https://github.com/dvynohradov</a></li>
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
