import OBR, { type GridScale } from "@owlbear-rodeo/sdk";
import { createContext, useContext, useState, useEffect } from "react";
import { getPluginId } from "../util/getPluginId";
import {
  defaultRanges,
  Range,
  GridDisplay,
  resolveGridDisplay,
} from "../ranges/ranges";

type OBRContextValue = {
  gridScale: GridScale;
  range: Range;
  gridDisplay: GridDisplay;
  gridDisplayOverride: GridDisplay | null;
};

const OBRContext = createContext<OBRContextValue | null>(null);

export function OBRContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<OBRContextValue | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      OBR.scene.grid.getScale(),
      OBR.scene.grid.getType(),
      OBR.scene.getMetadata(),
    ]).then(([gridScale, gridType, metadata]) => {
      if (!mounted) return;
      const range = (metadata[getPluginId("range")] ??
        defaultRanges[0]) as Range;
      const override = metadata[getPluginId("gridDisplay")] as
        | GridDisplay
        | null
        | undefined;
      const gridDisplayOverride = override ?? null;
      const gridDisplay = resolveGridDisplay(gridType, gridDisplayOverride);
      setValue({ gridScale, range, gridDisplay, gridDisplayOverride });
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!value) {
    return null;
  }

  return (
    <OBRContext.Provider value={value}>
      {children}
    </OBRContext.Provider>
  );
}

export function useOBRContext() {
  const context = useContext(OBRContext);
  if (!context) {
    throw new Error("useOBRContext must be used within an OBRContextProvider");
  }
  return context;
}
