import type { RefObject } from "react";

import { EndOfResults } from "~/components/EndOfResults";

export function InfiniteScrollStatus(props: {
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  observerRef: RefObject<HTMLDivElement>;
}) {
  return (
    <>
      {props.hasMore && (
        <div
          ref={props.observerRef}
          className="flex h-10 items-center justify-center"
        >
          {props.loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>
      )}
      {props.error && <div className="text-red-500">{props.error}</div>}
      {!props.hasMore && <EndOfResults />}
    </>
  );
}
