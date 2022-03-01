import { useState, useEffect } from "react";

export const useIframeLoaded = (iframe, name) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  useEffect(() => {
    const onLoad = () => {
      setIframeLoaded(true);
    };
    iframe.current?.addEventListener?.("load", onLoad);
    return () => {
      iframe.current?.removeEventListener?.("load", onLoad);
    };
  }, [name]);
  return iframeLoaded;
};
