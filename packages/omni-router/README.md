# Omni Router

To install and build the router for production, please run following commands:

- `npm install`
- `npm run build`

For development, you can use:

- `npm run watch`

## Features

- uses modern [Navigation API](https://github.com/WICG/navigation-api)
- framework independent
- server side rendering
- redirections
- error handling
- link resolutions

## Concepts

### Router

Router is an entity that manages application routing.
It allows you to register routes, that will be automatically handled.

### Route

Route is a representation of route that have `name`, `path`, `params` and optionally `data`.
It can be in handled state (when `data` is available) or not (when `data` is null).

### Route Declaration

Route declaration is description of how the routing should look like.
It describes followings fields: `name`, `path` (pattern) and `handler`.

### Route Handler

Route handler is a function that is executed when route is being opened.
It receives `params` as argument and returns `data`, which is assigned to the route.
Handlers can also be lazy loaded.

### Route Processor

Route processor is an object with optional listener methods, which can be executed on specific router actions.
There are 7 available listeners so far:
`onGetRouteStart`, `onGetRouteEnd`, `onOpenRouteStart`, `onOpenRouteEnd`, `onOpenRouteSuccess`, `onOpenRouteError`, `onOpenRouteAbort`
It's used for processing data returned in handlers, so that repetitive actions can be achieved for all specific routes.

## Guides

### Creating router

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

### Registering routes

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

### Creating handler

Route handler should only return `data` for further processing.
It shouldn't perform any visible action to the user.
Route parameters are passed as a first argument.
Object containing router and abort signal is passed as a second parameter.

```typescript
async function homeRouteHandler(params: HomeRouteParams, info: RouteInfo): Promise<HTMLRouteData> {
    const homeData = await homeApi.getData();
    return {
        html: {
            content: renderHomePage(homeData)
        }
    };
}
```

### Finding the route

You can find the route by its name or path:

```typescript
homeRoute = router.getRouteByName('home');
homeRoute = router.getRouteByPath('/');
```

Now you can use it in anchors (route is automatically serialized to its path when used as string):

```html
<a href={homeRoute.path}/>Home</a>
<a href={homeRoute}/>Home</a>
```

Remember that this way you get unhandled route (without `data`), because `data` is only available after opening the route.

### Opening the route

You can open the route programmatically. You will get the handled route (with `data`).

```typescript
await router.openRouteByName('home');
await router.openRouteByPath('/');
```

### Parameters

There are 3 types of parameters:

- named parameters
- query parameters
- wildcard parameters

All parameters are strings. If you want to use them as numbers, remember to parse them firstly.

Named parameters are parameters that are defined in path pattern with ":" prefix:

```typescript
interface PostsParams {
    page: string;
}

router.registerRoute({
    name: 'posts',
    path: '/posts/:page',
    handler: /* ... */
});

router.getRouteByName('posts', {page: '1'});
// {name: 'posts', path: '/posts/1', params: {page: '1'}}
```

Query parameters are additional parameters which are not defined in path pattern:

```typescript
interface PostsParams {
    page: string;
}

router.registerRoute({
    name: 'posts',
    path: '/posts',
    handler: /* ... */
});

router.getRouteByName('posts', {page: '1'});
// {name: 'posts', path: '/posts?page=1', params: {page: '1'}}
```

Wildcard parameters are like named parameters, but instead of a name, they have just a number assigned (starting with 0):

```typescript
interface PostsParams {
    page: string;
}

router.registerRoute({
    name: 'posts',
    path: '/posts/*',
    handler: /* ... */
});

router.getRouteByName('posts', {0: '1'});
// {name: 'posts', path: '/posts/1', params: {page: '1'}}
```

You can define a fallback page (404 not found) with wildcard, but you have to register it as the last one:

```typescript
router.registerRoute({
    name: 'not-found',
    path: '/*',
    handler: /* ... */
});
```

### HTML processor

HTML processor injects HTML into specified elements.
By default, there is `content` property, which is injected into element with id `rootId`.
You can also define additional fragments, which you want to inject HTML into.
Please check the examples:

```html

<body>
    <header id="app-header"></header>
    <main id="app-main"></main>
</body>
```

```typescript
createHTMLRouteProcessor({
    rootId: 'app-main',
    fragmentsIds: {
        header: 'app-header'
    },
    renderHTML: (html) => `<div class="wrapper>{html}</div>`,
    renderError: (error) => `<div class="error">Error</div>`
})
```

```typescript
async function homeRouteHandler(params: HomeRouteParams): Promise<HTMLRouteData> {
    return {
        html: {
            content: `<p>Hello World!</p>`,
            fragments: {
                header: `Home`
            }
        }
    };
}
```

### Redirect processor

Redirect processor opens new route with history mode `replace`, so previous page is not available in browser history.

```typescript
createRedirectRouteProcessor()
```

```typescript
async function firstPostRouteHandler(): Promise<RedirectRouteData> {
    const firstPost = await postApi.getPosts({limit: 1})[0];
    return {
        redirect: {
            path: '/post/' + firstPost.id
        }
    };
}
```

### Meta processor

Meta processor sets page metadata like title, description, keywords, etc.

```typescript
createMetaRouteProcessor({
    modifier: (name, content) => {
        if (name === 'title') {
            return `${content} - MyApp`;
        }
        return content;
    },
    defaults: {
        title: 'MyApp'
    }
})
```

```typescript
async function homeRouteHandler(params: HomeRouteParams): Promise<MetaRouteData> {
    return {
        meta: {
            title: 'Home Page',
            description: 'Home Page of MyApp'
        }
    };
}
```

### Custom processor

You can create you own processors. There are 7 available methods so far:

- `onGetRouteStart`
- `onGetRouteEnd`
- `onOpenRouteStart`
- `onOpenRouteEnd`
- `onOpenRouteSuccess`
- `onOpenRouteError`
- `onOpenRouteAbort`

```typescript
interface BodyClassRouteData {
    bodyClass: string;
}

function createBodyClassRouteProcessor(): RouteProcessor<BodyClassRouteData> {
    return {
        onOpenRouteSuccess: async ({route}) => {
            document.body.className = route.data.bodyClass ?? '';
        }
    };
}
```

```typescript
async function homeRouteHandler(params: HomeRouteParams): Promise<ReactRouteData> {
    return {
        react: {
            bodyClass: 'home'
        }
    };
}
```