# Enzo Lib

**Enzo Lib** is a Luau UI library for building organized Roblox interfaces with windows, tabs, groupboxes, interactive controls, notifications, dialogs, loading screens, and overlays. This README documents the API implemented in the repository’s current `LibraryV2.lua.txt` source file. [1]

> **Hub branding:** The default example below uses the supplied hub icon, `rbxassetid://137471163061841`, as the window logo.

| Repository asset | Purpose |
|---|---|
| `LibraryV2.lua.txt` | The library source. Keep the filename unchanged when using the raw-GitHub loader shown below. |
| `README.md` | Setup guide, working usage example, and API reference. |
| `rbxassetid://137471163061841` | Enzo Hub logo asset used by the documented `Icon` setting. |

## Quick start

The following example loads the published library, creates an Enzo Hub window, adds a tab and groupbox, and demonstrates the primary controls. The option names, constructor names, and callback shapes in this example are verified against the current source. [1]

```lua
-- Load Enzo Lib from this repository.
local Library = loadstring(game:HttpGet(
    "https://raw.githubusercontent.com/voidhub9-dotcom/enzo-lib/main/LibraryV2.lua.txt"
))()

-- Create the main window. The Icon value is your Enzo Hub logo.
local Window = Library:CreateWindow({
    Title = "Enzo Hub",
    Footer = "Enzo Lib",
    Icon = "rbxassetid://137471163061841",
    Size = UDim2.fromOffset(720, 600),
    Center = true,
    AutoShow = true,
    Resizable = true,
    ToggleKeybind = Enum.KeyCode.RightControl,
})

-- Tabs accept either a table or positional values.
local MainTab = Window:AddTab({
    Name = "Main",
    Description = "Primary Enzo Hub controls",
})

-- AddLeftGroupbox and AddRightGroupbox are convenient groupbox constructors.
local Features = MainTab:AddLeftGroupbox("Features")
Features:AddLabel("Configure the features below.")
Features:AddDivider("Automation")

local AutoFarm = Features:AddToggle("AutoFarm", {
    Text = "Auto farm",
    Default = false,
    Callback = function(enabled)
        print("Auto farm is now", enabled)
    end,
})

Features:AddSlider("WalkSpeed", {
    Text = "Walk speed",
    Default = 16,
    Min = 8,
    Max = 100,
    Rounding = 0,
    Suffix = " studs/s",
    Callback = function(value)
        print("Selected speed:", value)
    end,
})

Features:AddDropdown("Mode", {
    Text = "Mode",
    Values = { "Safe", "Fast", "Custom" },
    Default = "Safe",
    Callback = function(value)
        print("Selected mode:", value)
    end,
})

Features:AddInput("Nickname", {
    Text = "Display name",
    Default = "",
    Placeholder = "Enter a name",
    Finished = true,
    Callback = function(text)
        print("Name:", text)
    end,
})

Features:AddButton("PrintStatus", {
    Text = "Print status",
    Func = function()
        print("Enzo Hub is ready.")
    end,
})

-- Controls can also be updated after creation.
AutoFarm:SetValue(true)
```

The loader above expects a runtime where `loadstring` and `game:HttpGet` are available. If your project packages the source as a `ModuleScript` instead, require that module and use the returned library table in the same way. The library creates a window through `Library:CreateWindow(...)` and returns the library table from the end of `LibraryV2.lua.txt`. [1]

## Window setup

`Library:CreateWindow(WindowInfo)` creates the main window. It validates supplied settings against built-in defaults, then returns a `Window` object. [1]

| Setting | Type | Default | Description |
|---|---:|---:|---|
| `Title` | `string` | `"Enzo Hub"` | Text shown in the title area. |
| `Footer` | `string` | `"Enzo Lib"` | Text shown along the bottom of the window. |
| `Icon` | `string` or asset ID | `"rbxassetid://137471163061841"` | A Roblox image URI such as `"rbxassetid://137471163061841"`, a numeric asset ID, or a supported icon name. |
| `IconSize` | `UDim2` | `UDim2.fromOffset(36, 36)` | Display size of the window icon. |
| `Size` | `UDim2` | `UDim2.fromOffset(720, 600)` | Initial window size. |
| `Center` | `boolean` | `true` | Centers the window when it is created. |
| `AutoShow` | `boolean` | `true` | Displays the window as soon as it is created. |
| `Resizable` | `boolean` | `true` | Enables resize handling. |
| `ToggleKeybind` | `Enum.KeyCode` | `Enum.KeyCode.RightControl` | Key used to toggle the window. |
| `GlobalSearch` | `boolean` | `false` | Enables global search behavior. |
| `ShowCustomCursor` | `boolean` | `true` | Shows the library’s custom cursor while the UI is open. |
| `NotifySide` | `string` | `"Right"` | Notification placement; use the library’s supported side names. |
| `SidebarCompacted` | `boolean` | `false` | Starts the sidebar in its compact layout. |
| `BackgroundImage` | `string` | `""` | Optional background image URI. |

The library also exposes window methods for runtime adjustment. `Window:SetFooter(text)`, `Window:SetBackgroundImage(image)`, `Window:SetCornerRadius(radius)`, `Window:SetAnimations(...)`, `Window:SetCompact(state)`, `Window:SetSidebarWidth(width)`, `Window:Toggle(value)`, and `Window:AddDialog(...)` are implemented in the current source. [1]

Every main window also includes a non-interactive two-layer **white glow** behind the UI. The glow is fixed to the main frame, so it stays aligned when the window is dragged or resized.

## Tabs and groupboxes

A window can contain tabs, while each normal tab can contain left and right groupboxes. The object hierarchy below is the standard layout pattern.

```text
Library
└── Window
    └── Tab
        ├── Left groupbox
        └── Right groupbox
```

| Constructor | Usage | Result |
|---|---|---|
| `Window:AddTab(name, icon, description)` | Positional form. | A normal tab object. |
| `Window:AddTab({ Name, Icon, Description })` | Table form. | A normal tab object. |
| `Tab:AddLeftGroupbox(name, iconName, visible, collapsed, disableCollapsing)` | Convenience method for the left column. | A groupbox object. |
| `Tab:AddRightGroupbox(name, iconName, visible, collapsed, disableCollapsing)` | Convenience method for the right column. | A groupbox object. |
| `Tab:AddGroupbox({ Side, Name, IconName, Visible, Collapsed, DisableCollapsing })` | Fully specified form; `Side` is `1` for left or `2` for right. | A groupbox object. |

Tabs provide `Show()`, `Hide()`, `SetVisible(boolean)`, and `Destroy()`. Groupboxes provide `SetCollapsed(boolean)`, `ToggleCollapsed()`, `Show()`, `Hide()`, `SetVisible(boolean)`, and `Destroy()`. [1]

## Controls

Groupboxes are the main container for controls. Each control accepts an identifier as its first argument, followed by its options table. The identifier lets your code retain a stable name for the control; store the returned object when you need to update it later.

| Constructor | Important options | Useful returned-object methods |
|---|---|---|
| `AddLabel(...)` | `Text`, `DoesWrap`, `Size`, `Visible` | `SetText`, `SetVisible`, `Destroy` |
| `AddDivider(...)` | A text string, or `{ Text, Margin, MarginTop, MarginBottom }` | `SetVisible`, `Destroy` |
| `AddButton(...)` | `Text`, `Func` or `Callback`, `DoubleClick`, `Tooltip`, `Disabled`, `Visible` | `SetText`, `SetDisabled`, `SetVisible`, `Destroy` |
| `AddToggle(id, info)` | `Text`, `Default`, `Callback`, `Changed`, `Risky`, `Disabled`, `Visible` | `SetValue`, `OnChanged`, `SetText`, `SetDisabled`, `SetVisible`, `Destroy` |
| `AddCheckbox(id, info)` | Uses the same principal fields as a toggle. | `SetValue`, `OnChanged`, `SetText`, `SetDisabled`, `SetVisible`, `Destroy` |
| `AddInput(id, info)` | `Text`, `Default`, `Placeholder`, `Finished`, `Numeric`, `VerifyValue`, `AllowEmpty`, `Callback`, `Changed` | `SetValue`, `OnChanged`, `SetText`, `SetDisabled`, `SetVisible`, `Destroy` |
| `AddSlider(id, info)` | `Text`, `Default`, `Min`, `Max`, `Rounding`, `Prefix`, `Suffix`, `Callback`, `Changed` | `SetValue`, `SetMin`, `SetMax`, `SetPrefix`, `SetSuffix`, `OnChanged`, `SetDisabled`, `SetVisible`, `Destroy` |
| `AddDropdown(id, info)` | `Text`, `Values`, `Default`, `Multi`, `DisabledValues`, `ValueImages`, `DragSelect`, `Callback`, `Changed` | `SetValue`, `SetValues`, `AddValues`, `SetDisabledValues`, `SetValueImages`, `OnChanged`, `SetVisible`, `Destroy` |
| `AddColorPicker(id, info)` | `Default`, `Callback`, `Changed` | `SetValue`, `SetValueRGB`, `OnChanged`, `Destroy` |
| `AddKeyPicker(id, info)` | `Text`, `Default`, `DefaultModifiers`, `Mode`, `Modes`, `Callback`, `Changed`, `Clicked` | `SetValue`, `SetText`, `GetState`, `OnChanged`, `OnClick`, `Destroy` |

The source also includes `AddViewport`, `AddImage`, `AddVideo`, `AddUIPassthrough`, `AddDependencyBox`, and `AddDependencyGroupbox` for richer interfaces. [1]

### Callback conventions

Callbacks receive the selected control value. In the primary controls, use the `Callback` field for the main action and `Changed` or `OnChanged` when you want to attach additional listeners.

```lua
local Settings = MainTab:AddRightGroupbox("Settings")

local Quality = Settings:AddDropdown("Quality", {
    Text = "Quality",
    Values = { "Low", "Medium", "High" },
    Default = "Medium",
    Callback = function(value)
        print("Quality changed to", value)
    end,
})

-- Update the dropdown later.
Quality:SetValues({ "Low", "Medium", "High", "Ultra" })
Quality:SetValue("High")

local Volume = Settings:AddSlider("Volume", {
    Text = "Volume",
    Min = 0,
    Max = 100,
    Default = 50,
    Suffix = "%",
    Callback = function(value)
        print("Volume:", value)
    end,
})

Volume:SetValue(75)
```

For inputs, set `Finished = true` when the callback should run after the player finishes editing rather than on every text change. If `Numeric = true`, treat the value in your callback as numeric input and validate it according to your feature’s needs. The library also accepts a `VerifyValue` function for custom input checking. [1]

## Notifications, dialogs, and lifecycle

The library includes higher-level UI helpers alongside normal controls. Use these features to provide feedback, confirmations, and clean shutdown behavior.

| API | Purpose |
|---|---|
| `Library:Notify(...)` | Displays a notification. |
| `Library:SetNotifySide(side)` | Changes notification placement. |
| `Window:AddDialog(id, info)` | Creates a dialog associated with the window. |
| `Library:CreateLoading(info)` | Creates a loading screen; the returned object supports message, description, progress, and error-page setters. |
| `Library:CreateOverlay(info)` | Creates an overlay whose returned object supports `SetRow`, `SetVisible`, and `Destroy`. |
| `Library:OnUnload(callback)` | Registers cleanup work to run when the library unloads. |
| `Library:Unload()` | Destroys the library UI and runs unload handling. |

Always clean up the UI if your script is ending or being reloaded:

```lua
Library:OnUnload(function()
    print("Enzo Lib unloaded cleanly")
end)

-- Call this when your script no longer needs the interface.
Library:Unload()
```

## Icons and the Enzo Hub logo

`Icon` values used by windows, tabs, and groupboxes are resolved through `Library:GetCustomIcon(...)`. A numeric value is normalized to a Roblox asset URI, and a valid URI can be used directly. This makes the supplied logo valid in the window setup:

```lua
Icon = "rbxassetid://137471163061841"
```

For tabs and groupboxes, use a valid Roblox image URI when you need a logo, or omit the icon argument entirely. The quick-start examples omit optional tab and groupbox icons so they do not depend on an external icon module. [1]

## Troubleshooting

| Symptom | What to check |
|---|---|
| The interface does not appear. | Confirm that the source loaded successfully, `AutoShow` is not set to `false`, and the script has access to the Roblox UI services it needs. |
| The raw loader fails. | Confirm the repository is public and that the raw URL still points to `main/LibraryV2.lua.txt`. |
| A callback does not run. | Confirm that the callback is named `Callback` for table-style control configuration, and that the control is not disabled. |
| A dropdown has no selectable value. | Confirm `Values` contains the intended items and that `Default` is a string in `Values` or a valid multi-select table. |
| An icon is missing. | Use `rbxassetid://...` for a Roblox image or omit the icon when no icon module is configured. |

## Source reference

The README intentionally tracks the current implementation instead of documenting features that are not present in this repository. When `LibraryV2.lua.txt` changes, update the relevant examples and API tables at the same time. [1]

## References

[1]: https://github.com/voidhub9-dotcom/enzo-lib/blob/main/LibraryV2.lua.txt "Enzo Lib source: LibraryV2.lua.txt"

---

**Enzo Lib** documentation is maintained alongside the library source in this repository.
