# Omni Router React

To install and build the router for production, please run following commands:

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