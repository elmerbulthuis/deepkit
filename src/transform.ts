import { getIn, setIn } from "./deep";

export interface Transformer<TObject> {

    get<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        T5 extends keyof TObject[T1][T2][T3][T4],
        TDefault = undefined,
        >(
            path: [T1, T2, T3, T4, T5],
            defaultValue?: TDefault,
    ): TObject[T1][T2][T3][T4][T5] | TDefault;

    get<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        TDefault = undefined,
        >(
            path: [T1, T2, T3, T4],
            defaultValue?: TDefault,
    ): TObject[T1][T2][T3][T4] | TDefault;

    get<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        TDefault = undefined,
        >(
            path: [T1, T2, T3],
            defaultValue?: TDefault,
    ): TObject[T1][T2][T3] | TDefault;

    get<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        TDefault = undefined,
        >(
            path: [T1, T2],
            defaultValue?: TDefault,
    ): TObject[T1][T2] | TDefault;

    get<
        T1 extends keyof TObject,
        TDefault = undefined,
        >(
            path: [T1],
            defaultValue?: TDefault,
    ): TObject[T1] | TDefault;

    get<
        TDefault = undefined,
        >(
            path: [],
            defaultValue?: TDefault,
    ): TObject | TDefault;

    //#endregion

    //#region overloads

    set<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        T5 extends keyof TObject[T1][T2][T3][T4],
        >(
            path: [T1, T2, T3, T4, T5],
            value: TObject[T1][T2][T3][T4][T5] | undefined,
    ): void;

    set<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        >(
            path: [T1, T2, T3, T4],
            value: TObject[T1][T2][T3][T4] | undefined,
    ): void;

    set<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        >(
            path: [T1, T2, T3],
            value: TObject[T1][T2][T3] | undefined,
    ): void;

    set<
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        >(
            path: [T1, T2],
            value: TObject[T1][T2] | undefined,
    ): void;

    set<
        T1 extends keyof TObject,
        >(
            target: TObject,
            path: [T1],
            value: TObject[T1] | undefined,
    ): void;

    set(
        target: TObject,
        path: [],
        value: TObject,
    ): void;

    //#endregion

}

export function transform<TObject extends object>(
    source: TObject,
    job: (transform: Transformer<TObject>) => void,
    mutate = false,
): TObject {
    let target: any = source;

    const get = (path: PropertyKey[], defaultValue?: any): any => {
        return getIn(target, path as any, defaultValue);
    };

    const set = (path: PropertyKey[], value: any): void => {
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

    job({ get, set } as Transformer<TObject>);

    return target;
}
