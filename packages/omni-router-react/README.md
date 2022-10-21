# Omni Router React

Additional package to Omni Router, which can be used while working with React application. It contains only a processor used for rendering react components.
For details of Omni Router please see https://github.com/ardentcode/omni-router/tree/main/packages/omni-router

## Build & Development

To install and build, please run following commands:

- `npm install`
- `npm run build`

For development, you can use:

- `npm run watch`

## Usage

React processor renders react components in specified react root.

```typescript jsx
createReactRouteProcessor({
    reactRoot: createRoot(rootElement),
    renderComponent: (node: ReactNode) => <Wrapper>{node}</Wrapper>,
    renderError: (error: unknown) => <ErrorView error={error}>
});
```

```typescript jsx
async function homeRouteHandler(params: HomeRouteParams): Promise<ReactRouteData> {
    return {
        react: {
            component: <HomeView/>
        }
    };
}
```
