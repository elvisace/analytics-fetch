import { AnalyticsPlugin } from "analytics";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchRetry = async (url: string, options: RequestInit, depth = 0, maxDepth = 3): Promise<void> => {
  try {
    await fetch(url, options);
  } catch (err) {
    if (depth > maxDepth) {
      console.error(err);
    }
    await wait(2 ** depth * 20);

    return fetchRetry(url, options, depth + 1, maxDepth);
  }
};

type PluginConfig = {
  url: string;
  env: string;
};

type AnyPluginProps = {
  payload: any;
  config: PluginConfig;
};

// return object for analytics to use
const postPayload = (url: string, payload: any, depth?: number, maxDepth?: number) =>
  fetchRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(payload),
    },
    depth,
    maxDepth
  );

export const analyticsPlugin = (
  getUrl: (action: string) => string,
  depth?: number,
  maxDepth?: number,
  onErr?: (err: any) => any
): AnalyticsPlugin => {
  const plugin: AnalyticsPlugin = {
    name: "analytics-plugin",
    page: ({ payload }: AnyPluginProps) => {
      const url = getUrl("page");
      postPayload(url, payload, depth, maxDepth)?.then().catch(err => onErr ? onErr(err) : null);
    },
    track: ({ payload }: AnyPluginProps) => {
      const url = getUrl("track");
      postPayload(url, payload, depth, maxDepth)?.then().catch(err => onErr ? onErr(err) : null);
    },
    identify: ({ payload }: AnyPluginProps) => {
      const url = getUrl("identifyk");
      postPayload(url, payload, depth, maxDepth)?.then().catch(err => onErr ? onErr(err) : null);
    },
    loaded: () => true,
  };

  return plugin;
};

