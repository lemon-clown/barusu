import { Command, createTopCommand } from '@barusu/util-cli'
import { COMMAND_NAME, packageVersion } from '../util/env'


/**
 * Create a top commander instance with default global options
 */
export function createProgram(): Command {
  const program = createTopCommand(
    COMMAND_NAME,
    packageVersion,
  )

  // global options
  program
    .option('--encoding <encoding>', 'default encoding of files in the workspace')
    .option('--secret-filepath <secretFilepath>', 'path of secret file')
    .option('--secret-file-encoding <secretFileEncoding>', 'encoding of secret file')
    .option('--index-filepath <indexFilepath>', 'path of index file of ciphertext files')
    .option('--index-file-encoding <indexFileEncoding>', 'encoding of index file')
    .option('--ciphertext-root-dir <ciphertextRootDir>', 'the directory where the encrypted files are stored')
    .option('--plaintext-root-dir <plaintextRootDir>', 'the directory where the source plaintext files are stored')
    .option('--show-asterisk', 'whether to print password asterisks')
    .option('--minimum-password-length', 'the minimum size required of password')

  return program
}
