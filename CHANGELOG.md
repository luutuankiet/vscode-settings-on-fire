### Version 2.0.0
- Renamed to **Settings Toggle for Web**, with its own name, icon, description and overview
- Configuration key renamed from `settingsOnFire.toggle` to `settingsToggle.groups`
- Command renamed to `settingsToggle.run` ("Toggle Setting Group")
- Original icon artwork; upstream artwork removed from the repository
- Attribution to the upstream project stated in the README and LICENSE

  Migration: rename your `settingsOnFire.toggle` block to `settingsToggle.groups`. The shape of the
  configuration is unchanged.

### Version 1.0.4
- Web extension support — runs in vscode.dev / github.dev (browser), desktop, and Remote-SSH/WSL/Container workspaces
- Build migrated to esbuild with dual node + web bundles (`main` + `browser`)
- Toggle state keys now accept `turn_on`/`turn_off` as well as `on`/`off`
- Object settings deep-merge recursively, so toggles writing into the same setting stack instead of overwriting

### Version 1.0.3
- Skip `_label` key in settings config

### Version 1.0.1
- Excluded unneeded files from extension

### Version 1.0.0
- Initial release
