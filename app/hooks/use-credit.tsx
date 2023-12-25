import LiveState from 'phx-live-state';
import { useEffect, useMemo, useState } from 'react';

export type Request<T extends any> = {
  id: string;
  resp_body_chunks: string[];
  req_metadata: T;
  status: string;
  resp_code: null | number;
};

export const useCreditSession = <Metadata extends any>(
  sessionId?: string | null
) => {
  const liveState = useMemo(
    () =>
      sessionId
        ? new LiveState({
            // url: "ws://localhost:4000/socket",
            url: process.env.NEXT_PUBLIC_USE_CREDIT_WS,
            topic: `session:${sessionId}`,
            params: {
              // token: "1234",
              key: process.env.NEXT_PUBLIC_USE_CREDIT_PUBLIC_SHAREABLE
            }
          })
        : null,
    [sessionId]
  );
  const [state, setState] = useState<
    | undefined
    | {
        session: { id: string; requests: Request<Metadata>[] };
        active_requests: Record<string, Request<Metadata>>;
      }
  >();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!liveState) return;
    liveState.connect();
    let handler = () => {
      setState(liveState.state);
      setConnected(liveState.connected);
    };
    // liveState.addEventListener("livestate-patch", handler);
    liveState.addEventListener('livestate-change', handler);
    return () => {
      //   liveState.disconnect();
      // liveState.removeEventListener("livestate-patch", handler);
      liveState.removeEventListener('livestate-change', handler);
    };
  }, [liveState]);
  return { connected, state };
};
