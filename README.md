# UI Router

## Usage

### Concepts

#### Router

Router is an entity that manages application routing.
It allows you to register routes, that will be automatically handled.

#### Route

Route is a representation of route that have `name`, `path`, `params` and optionally `data`.
It can be in handled state (when `data` is available) or not (when `data` is null).

#### Route Declaration

Route declaration is description of how the routing should look like.
It describes followings fields: `name`, `path` (pattern) and `handler`.

#### Route Handler

Route handler is a function that is executed when route is being opened.
It receives `params` as argument and returns `data`, which is assigned to the route.
Handlers can also be lazy loaded.

#### Route Processor

Route processor is an object with optional listener methods, which can be executed on specific router actions.
There are 7 available listeners so far:
`onGetRouteStart`, `onGetRouteEnd`, `onOpenRouteStart`, `onOpenRouteEnd`, `onOpenRouteSuccess`, `onOpenRouteError`, `onOpenRouteAbort`

### Guides

#### Creating router

You need to define two types:

- map with all your routes, where keys represent route names and values represent their parameters
- structure of possible route data (returned by handler)

```typescript
interface RoutesMap {
    home: HomeRouteParams;
    post: PostRouteParams;
}

interface RoutesData extends HTMLRouteData, RedirectRouteData {

}

const router = createRouter<RoutesMap, RoutesData>();
```

#### Registering routes

To register route you only need to specify three properties: `name`, `path` and `handler`.

```typescript
router.registerRoute({
    name: 'home',
    path: '/',
    handler: async (params: HomeRouteParams) => {
        return {
            // ...
        };
    }
});
```

#### Creating handler

```typescript
async function homeRouteHandler(params: HomeRouteParams): HTMLRouteData {
    return {
        html: {
            content: 'Hello World!'
        }
    };
}
```

## Development

Please go to `/packages/ui-router` and use:

- `npm install` or `npm i`
- `npm run build`

Then for development you can use `npm run watch`