export type PropertyPath = PropertyKey[];

export function getIn<T extends object>(
    target: T,
    path: PropertyPath,
    defaultValue?: any,
): any {
    let found: any = target;
    for (const key of path) {
        if (typeof found !== "object") throw new Error(`${found} is not an object`);
        if (!(key in found)) return defaultValue;
        found = found[key];
    }
    return found;
}

export interface Transformer {
    get(path: PropertyPath, defaultValue?: any): any;
    set(path: PropertyPath, value: any): void;
    destroy(path: PropertyPath): void;
    merge(path: PropertyPath, value: any): void;
}

export function transform<T extends object>(
    source: T,
    job: (transform: Transformer) => void,
    mutate = false,
): T {
    let target: any = source;

    const get = (path: PropertyPath, defaultValue?: any): any => {
        return getIn(target, path, defaultValue);
    };

    const set = (path: PropertyPath, value: any): void => {
        if (path.length === 0) {
            target = value;
            return;
        }

        if (!mutate && target === source) target = { ... (source as object) };
        let targetParent: any = target;
        let sourceParent: any = source;
        let keyIndex = 0;
        const parentPathLength = path.length - 1;
        while (keyIndex < parentPathLength) {
            if (typeof targetParent !== "object") throw new Error(`${targetParent} is not an object`);

            const key = path[keyIndex];
            if (
                key in targetParent &&
                typeof targetParent[key] === "object" &&
                targetParent[key] !== null
            ) {
                if (
                    !mutate &&
                    sourceParent !== undefined &&
                    sourceParent[key] === targetParent[key]
                ) targetParent[key] = { ...targetParent[key] };
            }
            else {
                targetParent[key] = {};
            }
            targetParent = targetParent[key];
            sourceParent = sourceParent !== undefined && key in sourceParent ?
                sourceParent[key] :
                undefined;
            keyIndex++;
        }
        {
            const key = path[keyIndex];
            if (value === undefined) delete targetParent[key];
            else targetParent[key] = value;
        }
    };

    const destroy = (path: PropertyPath): void => {
        set(path, undefined);
    };

    const merge = (path: PropertyPath, value: any): void => {
        if (value !== null && typeof value === "object") {
            for (const key of Object.keys(value)) {
                merge([...path, key], value[key]);
            }
        }
        else set(path, value);
    };

    job({ get, set, destroy, merge });

    return target;
}

export function setIn<T extends object>(
    obj: T,
    path: PropertyPath,
    value: any,
    mutate = false,
): T {
    return transform(obj, ({ set }) => set(path, value), mutate);
}

export function destroyIn<T extends object>(
    obj: T,
    path: PropertyPath,
    mutate = false,
): T {
    return transform(obj, ({ destroy }) => destroy(path), mutate);
}

export function mergeIn<T extends object>(
    obj: T,
    path: PropertyPath,
    value: any,
    mutate = false,
): T {
    return transform(obj, ({ merge }) => merge(path, value), mutate);
}
