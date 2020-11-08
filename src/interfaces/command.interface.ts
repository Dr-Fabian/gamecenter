export default interface Command {
  file: string,
  name: string,
  inputs: Array<string>,
  mod: boolean,
  dev: boolean
}