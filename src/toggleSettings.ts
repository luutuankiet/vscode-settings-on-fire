import { ConfigurationTarget, ExtensionContext, window, workspace } from 'vscode'
import { RichQuickPickItem, ToggleConfig, OnOff } from './types'

const CONFIG_SECTION = 'settingsOnFire.toggle'

// Accept both on/off and turn_on/turn_off state keys from user config.
function getStateConfig(toggleConfig: ToggleConfig, name: string, state: OnOff) {
  const entry = (toggleConfig[name] || {}) as Record<string, any>
  return state === 'on' ? entry.on ?? entry.turn_on : entry.off ?? entry.turn_off
}

// Recursive deep-merge (patch): nested plain objects merge key-by-key; arrays/scalars overwrite.
function deepMerge(current: any, incoming: any): any {
  const isPlain = (v: any) => v && typeof v === 'object' && !Array.isArray(v)
  if (isPlain(current) && isPlain(incoming)) {
    const out: Record<string, any> = { ...current }
    for (const k in incoming) out[k] = deepMerge(current[k], incoming[k])
    return out
  }
  return incoming
}

export async function toggleSettings(context: ExtensionContext) {
  const config = workspace.getConfiguration()
  const toggleConfig = config.get(CONFIG_SECTION) as ToggleConfig | undefined

  if (!toggleConfig) {
    window.showErrorMessage('No Toggle configuration found.')
    return
  }

  const items = getQuickPickItems(context, toggleConfig)

  const selection = await window.showQuickPick(items)
  if (!selection) return

  const { name, newState, store, configTarget } = selection
  const settings = getStateConfig(toggleConfig, name, newState)
  if (!settings) {
    window.showErrorMessage(`Settings on 🔥: missing '${newState}'/'turn_${newState}' block for '${name}'.`)
    return
  }

  for (const key in settings) {
    if (key === '_label') continue

    const val = settings[key]
    const currentConfig = configValueForTarget(key, configTarget)
    let newConfig

    // Patch (deep-merge) objects into the existing value; overwrite scalars/arrays
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (currentConfig && typeof currentConfig !== 'object') {
        window.showErrorMessage(
          'Settings on 🔥 error! Toggle configuration specified is a different type than the existing one.',
        )
        return
      }
      newConfig = deepMerge(currentConfig, val)
    } else {
      newConfig = val
    }
    await config.update(key, newConfig, configTarget)
    store.update(name, newState)
  }
}

function configValueForTarget(configSection: string, target: ConfigurationTarget) {
  const data = workspace.getConfiguration().inspect(configSection)
  if (!data) return

  return target === ConfigurationTarget.Global
    ? data.globalValue
    : target === ConfigurationTarget.Workspace
      ? data.workspaceValue
      : data.workspaceFolderValue
}

function getConfigTargetForSection(configSection: string) {
  const data = workspace.getConfiguration().inspect(configSection)
  if (!data) return

  return data.workspaceValue !== undefined
    ? ConfigurationTarget.Workspace
    : ConfigurationTarget.Global
}

function getQuickPickItems(context: ExtensionContext, toggleConfig: ToggleConfig) {
  const items: RichQuickPickItem[] = []

  for (const name in toggleConfig) {
    const configTarget = getConfigTargetForSection(
      `${CONFIG_SECTION}.${name}`,
    ) as ConfigurationTarget

    const store =
      configTarget === ConfigurationTarget.Workspace ? context.workspaceState : context.globalState

    const currentState: OnOff = store.get(name) || 'off'
    const newState = currentState === 'on' ? 'off' : 'on'
    const stateConfig = getStateConfig(toggleConfig, name, newState) as { _label?: string } | undefined
    const description = (stateConfig && stateConfig._label) || newState

    items.push({
      label: name,
      description,
      name,
      newState,
      configTarget,
      store,
    })
  }

  return items
}
