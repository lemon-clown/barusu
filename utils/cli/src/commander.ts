import commander from 'commander'
import { CommandConfigurationOptions } from './option'


/**
 * Callback for handling the command
 *
 * @param args    command arguments
 * @param options command options
 * @param extra   extra args (neither declared command arguments nor command options)
 */
export type CommandActionCallback<T extends CommandConfigurationOptions> = (
  args: string[],
  options: T,
  extra: string[],
) => void | Promise<void> | never


export class Command extends commander.Command {
  /**
   * Register callback `fn` for the command.
   *
   * Examples:
   *
   *      program
   *        .command('help')
   *        .description('display verbose help')
   *        .action(function() {
   *           // output help here
   *        });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   * @api public
   */
  public action<T extends CommandConfigurationOptions>(fn: CommandActionCallback<T>): this {
    const self = this

    const listener = (args: string[]): void => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = self._args.length

      // const actionArgs: (string | Record<string, unknown> | string[])[] = [
      const actionArgs: [string[], T, string[]] = [
        // Command arguments
        args.slice(0, expectedArgsCount),

        // Command options
        self.opts() as T,

        // Extra arguments so available too.
        args.slice(expectedArgsCount)
      ]

      const actionResult = fn.apply(self, actionArgs)

      // Remember result in case it is async. Assume parseAsync getting called on root.
      let rootCommand: Command = self
      while (rootCommand.parent != null) {
        rootCommand = rootCommand.parent
      }
      rootCommand._actionResults.push(actionResult)
    }

    self._actionHandler = listener
    return self
  }

  // override
  public opts(): Record<string, unknown> {
    const self = this
    const nodes: Command[] = [self]
    for (let parent = self.parent; parent != null; parent = parent.parent) {
      nodes.push(parent)
    }

    const options: Record<string, unknown> = {}
    for (let i = nodes.length - 1; i >= 0; --i) {
      const o = nodes[i]
      if (o._storeOptionsAsProperties) {
        for (const option of o.options) {
          const key = option.attributeName()
          options[key] = (key === o._versionOptionName) ? o._version : o[key]
        }
      } else {
        for (const key of Object.getOwnPropertyNames(o._optionValues)) {
          options[key] = o._optionValues[key]
        }
      }
    }

    return options
  }

  // override
  public addCommand(command: Command): this {
    super.addCommand(command)
    return this
  }
}


export { commander }
