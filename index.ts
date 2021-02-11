import { AnalyticsPlugin } from "analytics";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchRetry = async (
  url: string,
  options: RequestInit,
  maxDepth = 3,
  depth = 0,
): Promise<void> => {
  try {
    await fetch(url, options);
  } catch (err) {
    if (depth > maxDepth) {
      throw err;
    }
    await wait(2 ** depth * 20);
    return fetchRetry(url, options, maxDepth, depth + 1);
  }
};

type AnyPluginProps = {
  payload: any;
};

// return object for analytics to use
const postPayload = (url: string, payload: any, onErr: (err: any) => void, maxDepth?: number) =>
  fetchRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(payload),
    },
    maxDepth,
  );

export type RestAnalyticsPluginProps = {
  /**
   * The name of the plugin
   * @default "rest-analytics-plugin"
   */
  name?: string;
  /**
   * The URL to `fetch` for actions: "page", "track", and "identify"
   */
  getUrl: (action: string) => string;
  /**
   * Max number of retries
   * @default 3
   */
  maxDepth?: number;
  onOk?: (type: "page" | "track" | "identify") => void;
  onErr?: (err: any) => void;
};

export const restAnalyticsPlugin = ({
  name = "rest-analytics-plugin",
  getUrl,
  maxDepth,
  onOk = () => void 0,
  onErr = console.error,
}: RestAnalyticsPluginProps): AnalyticsPlugin => {
  const plugin: AnalyticsPlugin = (["page", "track", "identify"] as const).reduce(
    (p, c) => {
      p[c] = ({ payload }: AnyPluginProps) => {
        postPayload(getUrl(c), payload, onErr, maxDepth)
          .then(() => onOk(c))
          .catch((err) => (onErr ? onErr(err) : null));
      };
      return p;
    },
    {
      name,
      loaded: () => true,
    } as AnalyticsPlugin,
  );
  return plugin;
};