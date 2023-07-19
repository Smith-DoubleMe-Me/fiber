import React, { useEffect, useRef } from "react";
import { Viewer as OriginalViewer } from "three/examples/jsm/capabilities/WebGL.js";

function Viewer({ options }) {
  const viewerElRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    viewerRef.current = new OriginalViewer(viewerElRef.current);
    return () => {
      viewerRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    // Handle viewer options updates
  }, [options]);

  return <div ref={viewerElRef} className="viewer"></div>;
}

export default Viewer;
