import { getIn } from "./deep";

interface TransformGet<TObject> {

    //#region overloads

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        T5 extends keyof TObject[T1][T2][T3][T4],
        >(
        path: [T1, T2, T3, T4, T5],
    ): TObject[T1][T2][T3][T4][T5];

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        >(
        path: [T1, T2, T3, T4],
    ): TObject[T1][T2][T3][T4];

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        >(
        path: [T1, T2, T3],
    ): TObject[T1][T2][T3];

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        >(
        path: [T1, T2],
    ): TObject[T1][T2];

    <
        T1 extends keyof TObject,
        >(
        path: [T1],
    ): TObject[T1];

    (
        path: [],
    ): TObject;

    //#endregion
}

interface TransformSet<TObject> {

    //#region overloads

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        T5 extends keyof TObject[T1][T2][T3][T4],
        >(
        path: [T1, T2, T3, T4, T5],
        value: TObject[T1][T2][T3][T4][T5],
    ): void;

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        T4 extends keyof TObject[T1][T2][T3],
        >(
        path: [T1, T2, T3, T4],
        value: TObject[T1][T2][T3][T4],
    ): void;

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        T3 extends keyof TObject[T1][T2],
        >(
        path: [T1, T2, T3],
        value: TObject[T1][T2][T3],
    ): void;

    <
        T1 extends keyof TObject,
        T2 extends keyof TObject[T1],
        >(
        path: [T1, T2],
        value: TObject[T1][T2],
    ): void;

    <
        T1 extends keyof TObject,
        >(
        path: [T1],
        value: TObject[T1],
    ): void;

    (
        path: [],
        value: TObject,
    ): void;

    //#endregion

}

export function transform<TObject>(
    source: TObject,
    job: (
        set: TransformSet<TObject>,
        get: TransformGet<TObject>,
    ) => void,
    mutate = false,
): TObject {
    let target: any = source;

    const get = (
        path: PropertyKey[],
    ) => {
        return getIn(
            target,
            path as [],
        );
    };

    const set = (
        path: PropertyKey[],
        value: unknown,
    ): void => {
        if (path.length === 0) {
            target = value;
            return;
        }

        if (!mutate && target === source) target = { ...source };
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

    job(set, get);

    return target;
}
