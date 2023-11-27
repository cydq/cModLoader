import { registry, LocalStore, Store } from ".";

export interface Mod {
  name: string;
  enabled: boolean;

  opt: ModOptions;

  options: Store;
  data: Store;

  emit(
    event: "enable" | "disable" | "load" | "unload" | "install" | "uninstall",
  ): void;
}

export interface ModOptions {
  name: string;
  autoRegister?: boolean;

  options?: {
    [key: string]: {
      type: "check" | "input";
      default?: any;
      name?: string;
      description?: string;
    };
  };

  /**
   * @deprecated Use handlers API instead
   */
  entry?: {
    enable?: (mod: Mod) => void;
    disable?: (mod: Mod) => void;
  };

  handlers?: {
    on: "enable" | "disable" | "load" | "unload" | "install" | "uninstall";
    conditions?: void;
    handle: (mod: Mod) => void;
  }[];
}

export function define(init: ModOptions | (() => ModOptions)): Mod {
  const opt = typeof init === "function" ? init() : init;

  if (!opt.name) throw new Error("[cML#define] Mod name is required");

  const handlers = opt.handlers ?? [];

  if (opt.entry?.enable)
    handlers.unshift({ on: "load", handle: opt.entry.enable });

  if (opt.entry?.disable)
    handlers.unshift({ on: "unload", handle: opt.entry.disable });

  const mod: Mod = {
    name: opt.name,
    enabled: false,

    opt,

    options: LocalStore.create(`cml.${opt.name}.options`),
    data: LocalStore.create(`cml.${opt.name}.data`),

    emit: (event) => {
      handlers.filter((h) => h.on === event).forEach((h) => h.handle?.(mod));

      if (event === "enable") mod.enabled = true;
      if (event === "disable") mod.enabled = false;
    },
  };

  if (opt.options) {
    for (const key of Object.keys(opt.options)) {
      const option = opt.options[key];
      if (!mod.options.has(key)) mod.options.set(key, option.default);
    }
  }

  if (opt.autoRegister !== false) registry.register(mod);

  return mod;
}
