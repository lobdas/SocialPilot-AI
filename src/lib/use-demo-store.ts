"use client";

import { useSyncExternalStore, useEffect, useState } from "react";
import { demoStore, DemoStoreData } from "./demo-store";
import { Brand, Workspace } from "./types";

export function useDemoStore() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    demoStore.initClient();
    setMounted(true);
  }, []);

  const rawData: DemoStoreData = useSyncExternalStore(
    (callback) => demoStore.subscribe(callback),
    () => demoStore.getData(),
    () => demoStore.getInitialData()
  );

  // During SSR and the initial client hydration pass, use initial data
  // to guarantee identical virtual DOM trees and eliminate hydration mismatches.
  const data = mounted ? rawData : demoStore.getInitialData();

  const activeBrand: Brand =
    data.brands.find((b) => b.id === data.activeBrandId) || data.brands[0];
  const activeWorkspace: Workspace =
    data.workspaces.find((w) => w.id === data.activeWorkspaceId) || data.workspaces[0];

  return {
    data,
    activeBrand,
    activeWorkspace,
    store: demoStore,
    mounted,
  };
}
