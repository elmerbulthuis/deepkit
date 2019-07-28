import { transform } from "./transform";

//#region overloads

export function getIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    T4 extends keyof Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>,
    T5 extends keyof Required<Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>[T4]>,
    TDefault = undefined,
    >(
        target: TObject,
        path: [T1, T2, T3, T4, T5],
        defaultValue?: TDefault,
): TObject[T1][T2][T3][T4][T5] | TDefault;

export function getIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    T4 extends keyof Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>,
    TDefault = undefined,
    >(
        target: TObject,
        path: [T1, T2, T3, T4],
        defaultValue?: TDefault,
): TObject[T1][T2][T3][T4] | TDefault;

export function getIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    TDefault = undefined,
    >(
        target: TObject,
        path: [T1, T2, T3],
        defaultValue?: TDefault,
): TObject[T1][T2][T3] | TDefault;

export function getIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    TDefault = undefined,
    >(
        target: TObject,
        path: [T1, T2],
        defaultValue?: TDefault,
): TObject[T1][T2] | TDefault;

export function getIn<
    TObject,
    T1 extends keyof Required<TObject>,
    TDefault = undefined,
    >(
        target: TObject,
        path: [T1],
        defaultValue?: TDefault,
): TObject[T1] | TDefault;

export function getIn<
    TObject,
    TDefault = undefined,
    >(
        target: TObject,
        path: [],
        defaultValue?: TDefault,
): TObject | TDefault;

//#endregion

export function getIn<
    TObject,
    TDefault = undefined,
    >(
        target: TObject,
        path: PropertyKey[],
        defaultValue?: TDefault,
): unknown | TDefault {
    let found: any = target;
    for (const key of path) {
        if (typeof found !== "object") throw new Error(`${found} is not an object`);
        if (found[key] === undefined) return defaultValue;
        found = found[key];
    }
    return found;
}

//#region overloads

export function setIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    T4 extends keyof Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>,
    T5 extends keyof Required<Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>[T4]>,
    >(
        target: TObject,
        path: [T1, T2, T3, T4, T5],
        value: TObject[T1][T2][T3][T4][T5] | undefined,
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    T4 extends keyof Required<Required<Required<Required<TObject>[T1]>[T2]>[T3]>,
    >(
        target: TObject,
        path: [T1, T2, T3, T4],
        value: TObject[T1][T2][T3][T4] | undefined,
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    T3 extends keyof Required<Required<Required<TObject>[T1]>[T2]>,
    >(
        target: TObject,
        path: [T1, T2, T3],
        value: TObject[T1][T2][T3] | undefined,
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof Required<TObject>,
    T2 extends keyof Required<Required<TObject>[T1]>,
    >(
        target: TObject,
        path: [T1, T2],
        value: TObject[T1][T2] | undefined,
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof Required<TObject>,
    >(
        target: TObject,
        path: [T1],
        value: TObject[T1] | undefined,
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    >(
        target: TObject,
        path: [],
        value: TObject,
        mutate?: boolean,
): TObject;

//#endregion

export function setIn<TObject>(
    obj: TObject,
    path: PropertyKey[],
    value: any,
    mutate = false,
): TObject {
    return transform(
        obj,
        set => set(path as [], value),
        mutate,
    );
}
