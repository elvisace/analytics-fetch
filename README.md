<!--
title: Fetch Analytics
description: Using the fetch analytics plugin
-->
# Fetch plugin for `analytics`

Integration with [the browser's fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for [analytics](https://www.npmjs.com/package/analytics)


<details>
<summary>Click to expand</summary>

- [Installation](#installation)
- [How to use](#how-to-use)
- [Platforms Supported](#platforms-supported)
- [Browser usage](#browser-usage)
  * [Browser API](#browser-api)
  * [Configuration options for browser](#configuration-options-for-browser)
- [Server-side usage](#server-side-usage)
  * [Server-side API](#server-side-api)
  * [Configuration options for server-side](#configuration-options-for-server-side)

</details>

## Installation

```bash
npm install analytics
npm install @standard-org/analytics-fetch
```


## How to use

The `@standard-org/analytics-fetch` package works in [the browser](#browser-usage) and [server-side in Node.js](#server-side-usage). To use, install the package, include in your project and initialize the plugin with [analytics](https://www.npmjs.com/package/analytics).

Below is an example of how to use the browser plugin.

```js
import Analytics from 'analytics'
import analyticsFetch from "@standardorg/analytics-fetch";

const analytics = Analytics({
  app: "bookclub",
  plugins: [
    analyticsFetch(
      (action) => `https://my-tracking-url.com/${action}`,
    ),
  ],
});

/* Track a page view */
analytics.page()

/* Track a custom event */
analytics.track('cartCheckout', {
  item: 'pink socks',
  price: 20
})

/* Identify a visitor */
analytics.identify('user-id-xyz', {
  firstName: 'bill',
  lastName: 'murray'
})

```

After initializing `analytics` with the `analyticsFetch` plugin, data will be sent to your own analytics endpoint whenever [analytics.page](https://getanalytics.io/api/#analyticspage), [analytics.track](https://getanalytics.io/api/#analyticstrack), or [analytics.identify](https://getanalytics.io/api/#analyticsidentify) are called.

## Platforms Supported

The `@standardorg/analytics-fetch` package works in [the browser](#browser-usage) and [server-side in Node.js](#server-side-usage)

## Browser usage

The Analytics Fetch client side browser plugin works with these analytic api methods:

- **[analytics.page](https://getanalytics.io/api/#analyticspage)** - Sends page views into your analytics url endpoint
- **[analytics.track](https://getanalytics.io/api/#analyticstrack)** - Track custom events and send to your analytics url endpoint
- **[analytics.identify](https://getanalytics.io/api/#analyticsidentify)** - Identify visitors and send details to your analytics url endpoint

### Browser API

```js
import Analytics from 'analytics'
import analyticsFetch from '@standardorg/analytics-fetch'

const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    analyticsFetch(
      (action) => `https://my-tracking-url.com/${action}`,
      3,
      (err) => console.error(err)
    )
  ]
})

```

### Configuration options for browser

| Option | description |
|:---------------------------|:-----------|
| `getUrl` <br/>**required** - function| A function that returns a string representing the url to which the payload should be sent to|
| `maxDepth` <br/>_optional_ - number| Max depth for exponential retries. Defaults to 3|
| `onErr` <br/>_optional_ - function| Callback for when any of the requests to your endpoint fail. Signature is (err: any) => any |

## Server-side usage

The Analytics Fetch server-side node.js plugin works with these analytic api methods:

- **[analytics.page](https://getanalytics.io/api/#analyticspage)** - Sends page views into your analytics url endpoint
- **[analytics.track](https://getanalytics.io/api/#analyticstrack)** - Track custom events and send to your analytics url endpoint
- **[analytics.identify](https://getanalytics.io/api/#analyticsidentify)** - Identify visitors and send details to your analytics url endpoint

### Server-side API

```js
import Analytics from 'analytics'
import analyticsFetch from "@standardorg/analytics-fetch";

const analytics = Analytics({
  app: "bookclub",
  plugins: [
    analyticsFetch(
      (action) => `https://my-tracking-url.com/${action}`,
      3,
      (err) => console.error(err)
    ),
  ],
});

```

### Configuration options for server-side

| Option | description |
|:---------------------------|:-----------|
| `getUrl` <br/>**required** - function| A function that returns a string representing the url to which the payload should be sent to|
| `maxDepth` <br/>_optional_ - number| Max depth for exponential retries. Defaults to 3|
| `onErr` <br/>_optional_ - function| Callback for when any of the requests to your endpoint fail. Signature is (err: any) => any |
