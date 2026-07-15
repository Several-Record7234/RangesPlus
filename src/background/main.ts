import OBR from "@owlbear-rodeo/sdk";
import { createRangeTool } from "./createRangeTool";
import { createThemeAction } from "./createThemeAction";
import { createSettingsAction } from "./createSettingsAction";
import { syncSettings } from "./syncSettings";
import { changelog, getUnseenEntries } from "../changelog";

async function waitUntilOBRReady() {
  return new Promise<void>((resolve) => {
    OBR.onReady(() => {
      resolve();
    });
  });
}

async function init() {
  await waitUntilOBRReady();
  syncSettings();
  createRangeTool();
  createThemeAction();
  createSettingsAction();

  // What's New modal (GM only, fires once per new version)
  try {
    const role = await OBR.player.getRole();
    if (role === "GM") {
      const lastSeen = localStorage.getItem("rangesplus:lastSeenVersion");
      if (!lastSeen) {
        if (changelog.length > 0) localStorage.setItem("rangesplus:lastSeenVersion", changelog[0].version);
      } else {
        const unseen = getUnseenEntries(changelog, lastSeen);
        if (unseen.length > 0) {
          OBR.modal.open({
            id: "dev.rangesplus.whats-new",
            url: `/whats-new.html?lastSeen=${encodeURIComponent(lastSeen)}`,
            width: 360,
            height: 480,
          }).then(() => {
            if (changelog.length > 0) localStorage.setItem("rangesplus:lastSeenVersion", changelog[0].version);
          }).catch(() => {});
        }
      }
    }
  } catch {
    // OBR not ready or role unavailable — skip
  }
}

init();
