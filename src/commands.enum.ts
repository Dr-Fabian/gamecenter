import Command from "./interfaces/command.interface";

const commands: Array<Command> = [
  {
    file: 'ping',
    name: 'Ping',
    inputs: ['ping'],
    dev: false,
    mod: false,
  },
  {
    file: 'help',
    name: 'Help',
    inputs: ['h', 'help'],
    dev: false,
    mod: false
  }
]

module.exports = commands;