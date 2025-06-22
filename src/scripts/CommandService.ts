import { content } from "./content";

type CommandFunction = () => string;
type Command = string | CommandFunction;

export class CommandService {
  private readonly commands: Record<string, Command>;

  constructor() {
    this.commands = {
      clear: "",
      help: content.help,
      about: content.about,
      skills: content.skills,
      experience: content.experience,
      philosophy: content.philosophy,
      contact: content.contact,
      date: () => new Date().toDateString(),
    };
  }

  getCommand(commandName: string): Command | undefined {
    return this.commands[commandName];
  }

  getCommandNames(): string[] {
    return Object.keys(this.commands);
  }

  executeCommand(name: string): string {
    const command = this.getCommand(name);

    if (typeof command === "function") {
      return command();
    }

    if (typeof command === "string") {
      return command;
    }

    return `bash: command not found: ${name}`;
  }
}
