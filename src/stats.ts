export interface CustomPropertyInfo {
  decl: boolean;
  used: number;
  deps: Set<string>;
  shouldRemove?: boolean;
  shorterName?: string;
}

export class CustomPropertiesStats {
  private storage: Record<string, CustomPropertyInfo> = {};

  public get(name: string) {
    return this.storage[name];
  }

  public has(name: string): boolean {
    return Boolean(this.storage[name]);
  }

  public isDeclared(name: string) {
    this.checkExists(name);
    return this.storage[name].decl;
  }

  public getShorterName(name: string) {
    this.checkExists(name);
    return this.storage[name].shorterName;
  }

  public addDep(name: string, dep: string) {
    this.ensureExists(name);
    this.ensureExists(dep);
    if (this.storage[name].deps.has(dep)) {
      return;
    }
    this.storage[name].deps.add(dep);
    this.storage[dep].used++;
  }

  public markDeclared(name: string, declared = true) {
    this.ensureExists(name);
    this.storage[name].decl = declared;
  }

  public increaseUsedCount(name: string) {
    this.ensureExists(name);
    this.storage[name].used++;
  }

  public decreaseUsedCount(name: string) {
    this.ensureExists(name);
    this.storage[name].used--;
  }

  public shrink(shortenName = true) {
    // remove unused
    const markShouldRemove = (name: string) => {
      if (!this.storage[name].decl) {
        return;
      }

      if (this.storage[name].used <= 0) {
        this.storage[name].shouldRemove = true;
        this.storage[name].deps.forEach((dep) => {
          if (this.storage[dep].shouldRemove) {
            return;
          }
          this.storage[dep].used--;
          markShouldRemove(dep);
        });
      }
    };

    Object.keys(this.storage).forEach((name) => {
      markShouldRemove(name);
    });

    if (!shortenName) {
      return;
    }

    // shorten
    let index = 0;
    Object.keys(this.storage).forEach((name) => {
      if (!this.storage[name].decl || this.storage[name].shouldRemove) {
        return;
      }
      this.storage[name].shorterName = `--${index.toString(36)}`;
      index++;
    });
  }

  private checkExists(name: string) {
    if (!this.storage[name]) {
      throw new Error(`property [${name}] does not exists`);
    }
  }

  private ensureExists(name: string) {
    if (!this.storage[name]) {
      this.storage[name] = {
        decl: false,
        used: 0,
        deps: new Set(),
      };
    }
  }
}
