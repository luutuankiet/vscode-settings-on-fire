import { commands, ExtensionContext, window } from 'vscode'
import { toggleSettings } from './toggleSettings'

export const activate = async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('settingsToggle.run', () => toggleSettings(context))
  )
}
