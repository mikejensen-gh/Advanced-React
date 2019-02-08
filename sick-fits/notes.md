# frontend

## to improve
align skew of logo and navbar links. don't skew text, just background


## vscode
vscode includes emmet by default. enable "emmet.includeLanguages": {"javascript": "javascriptreact"} in user preferences

## styled-components
- ThemeProvider uses React Context API. Wrap whole components in ThemeProvider to make these values available in all children.

### options for organizing styled components
- start by writing your styled components within the main component file. if you need it for something else, refactor out into its own component
- use a 'styles' folder in components
- use subfolders in components folder e.g. components/Header/{index.js|styles.js|__test__.js}

### injectGlobal
- used to apply styles to all child components from current component

## nprogress
- styled using nprogress.css in meta link

## apollo
- apollo-boost: includes the client as well caching, fetching, error and state management, all pre-configured
- withApollo from next-with-apollo - HOC which exposes the apollo client - useful for combining with next-with-apollo to prevent SSR issues

## links
https://nextjs.org/docs#custom-app
https://nextjs.org/docs#imperatively
https://nextjs.org/docs#custom-document
https://www.styled-components.com/docs/advanced/#nextjs
http://ricostacruz.com/nprogress/

# backend
# graphqlyoga + prisma
- return requirement "!" - value cannot be null
- when you modify datamodel.* you need to redeploy. modifying schema.graphql does not require redeployment

# links
https://graphql.org/learn/schema/#object-types-and-fields

## tools
https://hyper.is/
https://wesbos.com/uses/
https://www.youtube.com/watch?v=YIvjKId9m2c
https://docs.emmet.io/cheat-sheet/
https://code.visualstudio.com/docs/editor/emmet
https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save
https://code.visualstudio.com/docs/editor/userdefinedsnippetshttps://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf
https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets
https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag

## other
https://yeoman.io/
https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658
https://codeburst.io/next-js-ssr-vs-create-react-app-csr-7452f71599f6

react
create-react-app OR next.js
relay OR apollo
graphqlyoga
prisma
SERVER
