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
  const [gridScale, setGridScale] = useState<GridScale | null>(null);
  useEffect(() => {
    let mounted = true;
    OBR.scene.grid.getScale().then((scale) => {
      if (mounted) {
        setGridScale(scale);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const [gridType, setGridType] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    OBR.scene.grid.getType().then((type) => {
      if (mounted) {
        setGridType(type);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const [range, setRange] = useState<Range | null>(null);
  // undefined = not yet loaded, null = auto (no override)
  const [gridDisplayOverride, setGridDisplayOverride] = useState<
    GridDisplay | null | undefined
  >(undefined);
  useEffect(() => {
    let mounted = true;
    OBR.scene.getMetadata().then((metadata) => {
      if (mounted) {
        const range = (metadata[getPluginId("range")] ??
          defaultRanges[0]) as Range;
        setRange(range);
        const override = metadata[getPluginId("gridDisplay")] as
          | GridDisplay
          | null
          | undefined;
        setGridDisplayOverride(override ?? null);
      }
    });
  }, []);

  if (!gridScale || !range || !gridType || gridDisplayOverride === undefined) {
    return null;
  }

  const gridDisplay = resolveGridDisplay(gridType, gridDisplayOverride);

  return (
    <OBRContext.Provider
      value={{ gridScale, range, gridDisplay, gridDisplayOverride }}
    >
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
