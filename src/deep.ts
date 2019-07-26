import { transform } from "./transform";

//#region overloads

export function getIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    T4 extends keyof TObject[T1][T2][T3],
    T5 extends keyof TObject[T1][T2][T3][T4],
    >(
        target: TObject,
        path: [T1, T2, T3, T4, T5],
): TObject[T1][T2][T3][T4][T5];

export function getIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    T4 extends keyof TObject[T1][T2][T3],
    >(
        target: TObject,
        path: [T1, T2, T3, T4],
): TObject[T1][T2][T3][T4];

export function getIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    >(
        target: TObject,
        path: [T1, T2, T3],
): TObject[T1][T2][T3];

export function getIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    >(
        target: TObject,
        path: [T1, T2],
): TObject[T1][T2];

export function getIn<
    TObject,
    T1 extends keyof TObject,
    >(
        target: TObject,
        path: [T1],
): TObject[T1];

export function getIn<
    TObject,
    >(
        target: TObject,
        path: [],
): TObject;

//#endregion

export function getIn<
    TObject,
    >(
        target: TObject,
        path: PropertyKey[],
): unknown {
    let found: any = target;
    for (const key of path) {
        if (typeof found !== "object") throw new Error(`${found} is not an object`);
        found = found[key];
    }
    return found;
}

//#region overloads

export function setIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    T4 extends keyof TObject[T1][T2][T3],
    T5 extends keyof TObject[T1][T2][T3][T4],
    >(
        target: TObject,
        path: [T1, T2, T3, T4, T5],
        value: TObject[T1][T2][T3][T4][T5],
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    T4 extends keyof TObject[T1][T2][T3],
    >(
        target: TObject,
        path: [T1, T2, T3, T4],
        value: TObject[T1][T2][T3][T4],
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    T3 extends keyof TObject[T1][T2],
    >(
        target: TObject,
        path: [T1, T2, T3],
        value: TObject[T1][T2][T3],
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof TObject,
    T2 extends keyof TObject[T1],
    >(
        target: TObject,
        path: [T1, T2],
        value: TObject[T1][T2],
        mutate?: boolean,
): TObject;

export function setIn<
    TObject,
    T1 extends keyof TObject,
    >(
        target: TObject,
        path: [T1],
        value: TObject[T1],
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
