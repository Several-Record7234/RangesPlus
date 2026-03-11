import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../util/getPluginId";
import { getLastUsedRange } from "../settings/lastUsed";
import { defaultRanges } from "../ranges/ranges";

export function syncSettings() {
  onScene(async () => {
    const isGm = (await OBR.player.getRole()) === "GM";
    if (isGm) {
      await syncRangeIfNeeded();
    }
  });

  onGm(async () => {
    const sceneReady = await OBR.scene.isReady();
    if (sceneReady) {
      await syncRangeIfNeeded();
    }
  });
}

function onScene(func: () => void) {
  let fired = false;
  const run = () => {
    if (!fired) {
      fired = true;
      func();
    }
  };
  OBR.scene.onReadyChange((ready) => {
    if (ready) {
      run();
    }
  });
  OBR.scene.isReady().then((ready) => {
    if (ready) {
      run();
    }
  });
}

function onGm(func: () => void) {
  let fired = false;
  const run = () => {
    if (!fired) {
      fired = true;
      func();
    }
  };
  let isGm = false;
  OBR.player.onChange((player) => {
    if (player.role === "GM" && !isGm) {
      run();
    }
    isGm = player.role === "GM";
  });
  OBR.player.getRole().then((role) => {
    isGm = role === "GM";
    if (isGm) {
      run();
    }
  });
}

let syncPromise: Promise<void> | null = null;
async function syncRangeIfNeeded() {
  if (syncPromise) {
    return syncPromise;
  }
  syncPromise = (async () => {
    try {
      const metadata = await OBR.scene.getMetadata();
      const range = metadata[getPluginId("range")];
      if (range) {
        return;
      }
      const lastUsedRange = getLastUsedRange() ?? defaultRanges[0];
      await OBR.scene.setMetadata({ [getPluginId("range")]: lastUsedRange });
    } finally {
      syncPromise = null;
    }
  })();
  return syncPromise;
}
