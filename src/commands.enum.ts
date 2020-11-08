import Command from "./interfaces/command.interface";

const commands: Array<Command> = [
  {
    file: 'ping',
    name: 'Ping',
    inputs: ['h', 'help'],
    dev: false,
    mod: false,
  }
]