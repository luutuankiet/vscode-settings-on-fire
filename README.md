# Settings Toggle for Web

Keep several sets of VS Code settings on hand and flip between them from the Command Palette —
without opening `settings.json` and editing by hand. Groups can live in your global User Settings
or in the settings of the workspace you currently have open.

Unlike most settings-switching extensions, this one is packaged as a **web extension**, so it works
in a browser tab on [vscode.dev](https://vscode.dev) and github.dev, not just on the desktop.

## Attribution

This project began as a fork of [Settings on 🔥!](https://github.com/ericbiewener/vscode-settings-on-fire)
by Eric Biewener, used under the MIT license. It has since been rebranded and reworked — the
browser build, the recursive merge behaviour, the alternate state keys, and the esbuild pipeline are
additions made in this fork. The original project remains available under its own name and is not
affiliated with this one.

## Usage

Run **Toggle Setting Group** from the Command Palette. You get a picker listing every group you have
defined, along with the state each one will move to if you select it. Pick one, and the settings in
that block are written to your configuration. Groups start out in the `off` state.

## Configuration

Define your groups under `settingsToggle.groups`:

```json
"settingsToggle.groups": {
  "Color Theme": {
    "on": {
      "workbench.colorTheme": "Ayu Mirage"
    },
    "off": {
      "workbench.colorTheme": "Ayu Light"
    }
  },
  "Tests": {
    "on": {
      "files.exclude": {
        "**/__tests__": false,
        "**/*.spec.js": false
      }
    },
    "off": {
      "files.exclude": {
        "**/__tests__": true,
        "**/*.spec.js": true
      }
    }
  }
}
```

`on` and `off` may also be spelled `turn_on` and `turn_off`, whichever reads better to you.

### Labels

Add a `_label` key to a state block to control the text shown beside the group name in the picker:

```json
"settingsToggle.groups": {
  "Color Theme": {
    "on": {
      "_label": "Dark",
      "workbench.colorTheme": "Ayu Mirage"
    },
    "off": {
      "_label": "Light",
      "workbench.colorTheme": "Ayu Light"
    }
  }
}
```

### How values are written

A value that is a plain object is merged into whatever is already configured, recursively — so two
groups that both write into `workbench.editorAssociations` will stack rather than clobber each
other. Arrays and scalar values simply replace what was there before.

## Where it runs

The command relies only on the core VS Code configuration API, so behaviour is the same in the
browser, on the desktop, and in Remote-SSH, WSL and Dev Container workspaces.

## License

MIT. See [LICENSE](LICENSE).
