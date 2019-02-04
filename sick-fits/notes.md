# to improve
align skew of logo and navbar links. don't skew text, just background


# vscode
vscode includes emmet by default. enable "emmet.includeLanguages": {"javascript": "javascriptreact"} in user preferences

# styled-components
- ThemeProvider uses React Context API. Wrap whole components in ThemeProvider to make these values available in all children.

## options for organizing styled components
- start by writing your styled components within the main component file. if you need it for something else, refactor out into its own component
- use a 'styles' folder in components
- use subfolders in components folder e.g. components/Header/{index.js|styles.js|__test__.js}

## injectGlobal
- used to apply styles to all child components from current component

# nprogress
- styled using nprogress.css in meta link
