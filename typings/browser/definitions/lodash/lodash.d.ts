// Compiled using typings@0.6.8
// Source: https://raw.githubusercontent.com/david-driscoll/lodash-ts/master/out/lodash.d.ts
declare module 'lodash/out/lodash' {
namespace Types.Wrap {
    interface ArrayPassThrough<TWrapper> {
        (): TWrapper;
    }

    interface ArrayArgs<T, TWrapper> {
        (...args: T[]): TWrapper;
    }

    interface ArrayArrayArg<T, TWrapper> {
        (args: ArrayLike<T>): TWrapper;
    }

    interface ArrayValueThrough<T> {
        (): T;
    }

    interface Concat<T, TWrapper> {
        (...items: (T | T[])[]): TWrapper;
    }

    interface Difference<T, TWrapper> {
        (...values: ArrayLike<T>[]): TWrapper;
    }

    interface DifferenceBy<T, TWrapper> {
        (values?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, values5?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): TWrapper;
        (...values: (ArrayLike<T> | Iteratee<(value: T) => any>)[]): TWrapper;
    }

    interface DifferenceWith<T, TWrapper> {
        (values?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, iteratee?: ((value: T) => any) | string): TWrapper;
        (values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, values5?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): TWrapper;
        (...values: (ArrayLike<T> | ((arrVal: T, othVal: T) => boolean))[]): TWrapper;
    }

    interface Drop<TWrapper> {
        (num?: number): TWrapper;
    }

    interface DropWhile<T, TWrapper> {
        (predicate?: ArrayPredicate<T>): TWrapper;
    }

    interface Fill<T, TWrapper> {
        (value: T, start?: number, end?: number): TWrapper;
    }

    interface PullAll<T, TWrapper> {
        (values: ArrayLike<T>, iteratee?: ValuePredicate<T>): TWrapper;
    }

    interface PullAt<T, TWrapper> {
        (...indexes: (number | ArrayLike<number>)[]): TWrapper;
    }

    interface PullAllBy<T, TWrapper> {
        (values: ArrayLike<T>, iteratee?: ValuePredicate<T>): TWrapper;
    }

    interface Remove<T, TWrapper> {
        (predicate?: ArrayPredicate<T>): TWrapper;
    }

    interface Slice<T, TWrapper> {
        (start?: number, end?: number): TWrapper;
    }

    interface UniqBy<T, TWrapper> {
        (iteratee?: ValuePredicate<T>): TWrapper;
    }

    interface UniqWith<T, TWrapper> {
        (comparator?: (valueA: T, valueB: T) => boolean): TWrapper;
    }

    interface TakeWhile<T, TWrapper> {
        (predicate?: ArrayPredicate<T>): TWrapper;
    }

    interface ZipWith<T, TWrapper> {
        <TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): TWrapper;
    }

    interface RecursiveArrayLike<T> extends ArrayLike<T | RecursiveArrayLike<T>> { }
    interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }

    interface ArrayWrapper<T, TWrapper> {
        compact: ArrayPassThrough<T>;
        concat: Concat<T, TWrapper>;
        difference: Difference<T, TWrapper>;
        differenceBy: DifferenceBy<T, TWrapper>;
        differenceWith: DifferenceWith<T, TWrapper>;
        drop: Drop<TWrapper>;
        dropRight: Drop<TWrapper>;
        dropWhile: DropWhile<T, TWrapper>;
        dropWhileRight: DropWhile<T, TWrapper>;
        fill: Fill<T, TWrapper>;
        initial: ArrayPassThrough<T>;
        intersection: Difference<T, TWrapper>;
        intersectionBy: DifferenceBy<T, TWrapper>;
        intersectionWith: DifferenceWith<T, TWrapper>;
        pull: ArrayArgs<T, TWrapper>;
        pullAll: PullAll<T, TWrapper>;
        pullAt: PullAt<T, TWrapper>;
        remove: Remove<T, TWrapper>;
        reverse: ArrayPassThrough<T>;
        slice: Slice<T, TWrapper>;
        sortedUniq: ArrayPassThrough<T>;
        sortedUniqBy: UniqBy<T, TWrapper>;
        tail: ArrayPassThrough<T>;
        take: Drop<TWrapper>;
        takeRight: Drop<TWrapper>;
        takeWhile: DropWhile<T, TWrapper>;
        takeRightWhile: DropWhile<T, TWrapper>;
        union: Difference<T, TWrapper>;
        unionBy: DifferenceBy<T, TWrapper>;
        unionWith: DifferenceWith<T, TWrapper>;
        uniq: ArrayPassThrough<T>;
        uniqBy: UniqBy<T, TWrapper>;
        uniqWith: UniqWith<T, TWrapper>;
        unzip: ArrayArgs<T, TWrapper>;
        without: ArrayArgs<T, TWrapper>;
        xor: Difference<T, TWrapper>;
        xorBy: DifferenceBy<T, TWrapper>;
        xorWith: DifferenceWith<T, TWrapper>;
        zip: ArrayArgs<T, TWrapper>;
        // fromPairs
        // zipObject
        // zipObjectDeep
    }

    interface ImplicitArray<T, TWrapper extends ImplicitArray<T, TWrapper>> {
        chunk(size?: number): ImplicitArray1<T[]>;
        first: ArrayValueThrough<T>;
        head: ArrayValueThrough<T>;
        last: ArrayValueThrough<T>;
        flatten<TResult>(): ImplicitArray1<TResult>;
        flattenDeep<TResult>(): ImplicitArray1<TResult>;
        flattenDepth<T>(depth?: number): ImplicitArray1<T>;
        findIndex(predicate?: ArrayPredicate<T>): number;
        findLastIndex(predicate?: ArrayPredicate<T>): number;
        join(separator?: string): string;
        indexOf(value: T, fromIndex?: number): number;
        lastIndexOf(value: T, fromIndex?: number): number;
        sortedIndex(value: T): number;
        sortedIndexOf(value: T): number;
        sortedLastIndexOf(value: T): number;
        sortedIndexBy(value: T, predicate?: ValuePredicate<T>): number;
        sortedLastIndexBy(value: T, predicate?: ValuePredicate<T>): number;
        unzipWith<TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): ImplicitArray1<TResult>;
        zipWith<TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): ImplicitArray1<TResult>;
    }

    interface ExplicitArray<T, TWrapper extends ExplicitArray<T, TWrapper>> {
        chunk(size?: number): ExplicitArray1<T[]>;
        first: ArrayValueThrough<ExplicitValue1<T>>;
        head: ArrayValueThrough<ExplicitValue1<T>>;
        last: ArrayValueThrough<ExplicitValue1<T>>;
        flatten<T>(): ExplicitArray1<T>;
        flattenDeep<T>(): ExplicitArray1<T>;
        flattenDepth<T>(depth?: number): ExplicitArray1<T>;
        findIndex(predicate?: ArrayPredicate<T>): ExplicitValue1<number>;
        findLastIndex(predicate?: ArrayPredicate<T>): ExplicitValue1<number>;
        join(separator?: string): ExplicitString;
        indexOf(value: T, fromIndex?: number): ExplicitValue1<number>;
        lastIndexOf(value: T, fromIndex?: number): ExplicitValue1<number>;
        sortedIndex(value: T): ExplicitValue1<number>;
        sortedIndexOf(value: T): ExplicitValue1<number>;
        sortedLastIndexOf(value: T): ExplicitValue1<number>;
        sortedIndexBy(value: T, predicate?: ValuePredicate<T>): ExplicitValue1<number>;
        sortedLastIndexBy(value: T, predicate?: ValuePredicate<T>): ExplicitValue1<number>;
        unzipWith<TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): ExplicitArray1<TResult>;
        zipWith<TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): ExplicitArray1<TResult>;
    }
}
namespace Types {
    interface ArrayPassThrough {
        <T>(array: ArrayLike<T>): T[];
    }

    interface ArrayArgs {
        <T>(array: ArrayLike<T>, ...args: T[]): T[];
    }

    interface ArrayArrayArg {
        <T>(array: ArrayLike<T>, args: ArrayLike<T>): T[];
    }

    interface ArrayValueThrough {
        <T>(array: ArrayLike<T>): T;
    }

    interface Chunk {
        <T>(array: ArrayLike<T>, size?: number): T[][];
    }

    interface Concat {
        <T>(array: ArrayLike<T>, ...items: (T | T[])[]): T[];
    }

    interface Difference {
        <T>(array: ArrayLike<T>, ...values: ArrayLike<T>[]): T[];
    }

    interface DifferenceBy {
        <T>(array: ArrayLike<T>, values?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, values5?: ArrayLike<T>, iteratee?: Iteratee<(value: T) => any>): T[];
        <T>(array: ArrayLike<T>, ...values: (ArrayLike<T> | Iteratee<(value: T) => any>)[]): T[];
    }

    interface DifferenceWith {
        <T>(array: ArrayLike<T>, values?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, iteratee?: ((value: T) => any) | string): T[];
        <T>(array: ArrayLike<T>, values1?: ArrayLike<T>, values2?: ArrayLike<T>, values3?: ArrayLike<T>, values4?: ArrayLike<T>, values5?: ArrayLike<T>, comparator?: (arrVal: T, othVal: T) => boolean): T[];
        <T>(array: ArrayLike<T>, ...values: (ArrayLike<T> | ((arrVal: T, othVal: T) => boolean))[]): T[];
    }

    interface Drop {
        <T>(array: ArrayLike<T>, num?: number): T[];
    }

    interface DropWhile {
        <T>(array: ArrayLike<T>, predicate?: ArrayPredicate<T, ArrayLike<T>>): T[];
    }

    interface Flatten {
        <T>(array: ArrayLike<T | ArrayLike<T>>): T[];
        <T>(array: RecursiveArrayLike<T>): RecursiveArray<T>;
        <TResult>(array: ArrayLike<any>): TResult[];
    }

    interface FlattenDeep {
        <T>(array: ArrayLike<RecursiveArrayLike<T>>): T[];
    }

    interface FlattenDepth {
        <T>(array: ArrayLike<any>, depth?: number): T[];
    }

    interface FromPairs {
        <T>(array: ArrayLike<[number, T]>): { [index: number]: T; };
        <T>(array: ArrayLike<[any, T]>): { [index: string]: T; };
    }

    interface Join {
        <T>(array: ArrayLike<T>, separator?: string): string;
    }

    interface Fill {
        <T>(array: ArrayLike<T>, value: T, start?: number, end?: number): ArrayLike<T>;
    }

    interface FindIndex {
        <T>(array: ArrayLike<T>, predicate?: ArrayPredicate<T, ArrayLike<T>>): number;
    }

    interface IndexOf {
        <T>(array: ArrayLike<T>, value: T, fromIndex?: number): number;
    }

    interface PullAll {
        <T>(array: ArrayLike<T>, values: ArrayLike<T>, iteratee?: ValuePredicate<T>): T[];
    }

    interface PullAt {
        <T>(array: ArrayLike<T>, ...indexes: (number | ArrayLike<number>)[]): T[];
    }

    interface PullAllBy {
        <T>(array: ArrayLike<T>, values: ArrayLike<T>, iteratee?: ValuePredicate<T>): T[];
    }

    interface Remove {
        <T>(array: ArrayLike<T>, predicate?: ArrayPredicate<T, ArrayLike<T>>): ArrayLike<T>;
    }

    interface Slice {
        <T>(array: ArrayLike<T>, start?: number, end?: number): T[];
    }

    interface SortedIndex {
        <T>(array: ArrayLike<T>, value: T): number;
    }

    interface SortedIndexBy {
        <T>(array: ArrayLike<T>, value: T, predicate?: ValuePredicate<T>): number;
    }

    interface UniqBy {
        <T>(array: ArrayLike<T>, iteratee?: ValuePredicate<T>): T[];
    }

    interface UniqWith {
        <T>(array: ArrayLike<T>, comparator?: (valueA: T, valueB: T) => boolean): T[];
    }

    interface Zip {
        <T>(t: ArrayLike<T>): [T][];
        <T, T2>(t: ArrayLike<T>, t2: ArrayLike<T2>): [T, T2][];
        <T, T2, T3>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>): [T, T2, T3][];
        <T, T2, T3, T4>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>, t4: ArrayLike<T4>): [T, T2, T3, T4][];
        <T, T2, T3, T4, T5>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>, t4: ArrayLike<T4>, t5: ArrayLike<T5>): [T, T2, T3, T4, T5][];
        <TResult>(...arrays: ArrayLike<any>[]): TResult[];
    }

    interface Unzip {
        <T>(...arrays: [T][]): [T[]];
        <T, T2>(...arrays: [T, T2][]): [T[], T2[]];
        <T, T2, T3>(...arrays: [T, T2, T3][]): [T[], T2[], T3[]];
        <T, T2, T3, T4>(...arrays: [T, T2, T3, T4][]): [T[], T2[], T3[], T4[]];
        <T, T2, T3, T4, T5>(...arrays: [T, T2, T3, T4, T5][]): [T[], T2[], T3[], T4[], T5[]];
        <TResult>(...arrays: ArrayLike<any>[]): TResult[];
    }

    interface ZipWith {
        <T, TResult>(t: ArrayLike<T>, predicate?: Iteratee<(t: T) => TResult>): TResult[];
        <T, T2, TResult>(t: ArrayLike<T>, t2: ArrayLike<T2>, predicate?: Iteratee<(t: T, t2: T2) => TResult>): TResult[];
        <T, T2, T3, TResult>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>, predicate?: Iteratee<(t: T, t2: T2, t3: T3) => TResult>): TResult[];
        <T, T2, T3, T4, TResult>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>, t4: ArrayLike<T4>, predicate?: Iteratee<(t: T, t2: T2, t3: T3, t4: T4) => TResult>): TResult[];
        <T, T2, T3, T4, T5, TResult>(t: ArrayLike<T>, t2: ArrayLike<T2>, t3: ArrayLike<T3>, t4: ArrayLike<T4>, t5: ArrayLike<T5>, predicate?: Iteratee<(t: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult>): TResult[];
        <TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): TResult[];
    }

    interface UnzipWith {
        <T, TResult>(...arrays: ([T] | Iteratee<(t: T) => TResult>)[]): TResult[];
        <T, T2, TResult>(...arrays: ([T, T2] | Iteratee<(t: T, t2: T2) => TResult>)[]): TResult[];
        <T, T2, T3, TResult>(...arrays: ([T, T2, T3] | Iteratee<(t: T, t2: T2, t3: T3) => TResult>)[]): TResult[];
        <T, T2, T3, T4, TResult>(...arrays: ([T, T2, T3, T4] | Iteratee<(t: T, t2: T2, t3: T3, t4: T4) => TResult>)[]): TResult[];
        <T, T2, T3, T4, T5, TResult>(...arrays: ([T, T2, T3, T4, T5] | Iteratee<(t: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult>)[]): TResult[];
        <TResult>(...arrays: (ArrayLike<any> | Iteratee<(...args: any[]) => TResult>)[]): TResult[];
    }

    interface ZipObject {
        <T, TResult extends _Obj<T>>(props?: string[], values?: ArrayLike<T>): TResult;
    }

    interface RecursiveArrayLike<T> extends ArrayLike<T | RecursiveArrayLike<T>> { }
    interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }
}

interface IStatic {
    chunk: Types.Chunk;
    compact: Types.ArrayPassThrough;
    concat: Types.Concat;
    difference: Types.Difference;
    differenceBy: Types.DifferenceBy;
    differenceWith: Types.DifferenceWith;
    drop: Types.Drop;
    dropRight: Types.Drop;
    dropWhile: Types.DropWhile;
    dropWhileRight: Types.DropWhile;
    fill: Types.Fill;
    findIndex: Types.FindIndex;
    findLastIndex: Types.FindIndex;
    first: Types.ArrayValueThrough;
    flatten: Types.Flatten;
    flattenDeep: Types.FlattenDeep;
    flattenDepth: Types.FlattenDepth;
    fromPairs: Types.FromPairs;
    head: Types.ArrayValueThrough;
    indexOf: Types.IndexOf;
    initial: Types.ArrayPassThrough;
    intersection: Types.Difference;
    intersectionBy: Types.DifferenceBy;
    intersectionWith: Types.DifferenceWith;
    join: Types.Join;
    last: Types.ArrayValueThrough;
    lastIndexOf: Types.IndexOf;
    pull: Types.ArrayArgs;
    pullAll: Types.PullAll;
    pullAt: Types.PullAt;
    remove: Types.Remove;
    reverse: Types.ArrayPassThrough;
    slice: Types.Slice;
    sortedIndex: Types.SortedIndex;
    sortedIndexOf: Types.SortedIndex;
    sortedLastIndexOf: Types.SortedIndex;
    sortedIndexBy: Types.SortedIndexBy;
    sortedLastIndexBy: Types.SortedIndexBy;
    sortedUniq: Types.ArrayPassThrough;
    sortedUniqBy: Types.UniqBy;
    tail: Types.ArrayPassThrough;
    take: Types.Drop;
    takeRight: Types.Drop;
    takeWhile: Types.DropWhile;
    takeRightWhile: Types.DropWhile;
    union: Types.Difference;
    unionBy: Types.DifferenceBy;
    unionWith: Types.DifferenceWith;
    uniq: Types.ArrayPassThrough;
    uniqBy: Types.UniqBy;
    uniqWith: Types.UniqWith;
    unzip: Types.Unzip;
    unzipWith: Types.UnzipWith;
    without: Types.ArrayArgs;
    xor: Types.Difference;
    xorBy: Types.DifferenceBy;
    xorWith: Types.DifferenceWith;
    zip: Types.Zip;
    zipWith: Types.ZipWith;
    zipObject: Types.ZipObject;
    zipObjectDeep: Types.ZipObject;
}
namespace Types.Wrap {
    interface ForEach<T, TWrapper> {
        (iteratee?: Iteratee<(value: T, index: number) => boolean | void>): TWrapper;
    }

    interface ForEachObject<T, TWrapper> {
        (iteratee?: Iteratee<(value: T, index: string) => boolean | void>): TWrapper;
    }

    interface OrderBy<T, TWrapper> {
        (iteratee?: ValuePredicate<T> | ValuePredicate<T>[], orders?: ("asc" | "desc") | ("asc" | "desc")[]): TWrapper;
    }

    interface Shuffle<TWrapper> {
        (): TWrapper;
    }

    interface SortBy<T, TWrapper> {
        (iteratee?: ValuePredicate<T> | ValuePredicate<T>[]): TWrapper;
    }

    interface ArrayWrapper<T, TWrapper> {
        forEach: ForEach<T, TWrapper>;
        forEachRight: ForEach<T, TWrapper>;
        each: ForEach<T, TWrapper>;
        eachRight: ForEach<T, TWrapper>;
        orderBy: OrderBy<T, TWrapper>;
        sampleSize(n?: number): TWrapper;
        shuffle: Shuffle<TWrapper>;
        sortBy: SortBy<T, TWrapper>;
    }

    interface ImplicitWrapper<T, TWrapper> {
        countBy(iteratee: ValuePredicate<T>): { [index: string]: number; };
        every(iteratee?: ArrayPredicate<T>): boolean;
        filter(iteratee?: ArrayPredicate<T>): TWrapper;
        find(iteratee?: ArrayPredicate<T>): T;
        findLast(iteratee?: ArrayPredicate<T>): T;
        flatMap<TResult>(iteratee?: Iteratee<(value: T, index: number) => TResult[]>): ImplicitArray1<TResult>;
        includes(value: T, fromIndex?: number): boolean;
        invokeMap<TResult>(path: PathLocation | Function, ...args: any[]): ImplicitArray1<TResult>;
        keyBy(iteratee?: ValuePredicate<T>): { [index: string]: T; };
        map<TResult>(iteratee?: Iteratee<(value: T, index: number) => TResult>): ImplicitArray1<TResult>;
        groupBy(iteratee: ValuePredicate<T>): { [index: string]: T; };
        partition(iteratee?: ValuePredicate<T>): ImplicitValue1<[T[], T[]]>;
        reduce<TAcc>(iteratee?: AccumulatorArrayPredicate<T, TAcc>): TAcc;
        reduceRight<TAcc>(iteratee?: AccumulatorArrayPredicate<T, TAcc>): TAcc;
        reject(iteratee?: ArrayPredicate<T>): TWrapper;
        sample(): T;
        size(): number;
        some(iteratee?: ArrayPredicate<T>): boolean;
    }

    interface ExplicitWrapper<T, TWrapper> {
        countBy(iteratee: ValuePredicate<T>): ExplicitValue1<{ [index: string]: number; }>;
        every(iteratee?: ArrayPredicate<T>): ExplicitValue1<boolean>;
        filter(iteratee?: ArrayPredicate<T>): TWrapper;
        find(iteratee?: ArrayPredicate<T>): ExplicitValue1<T>;
        findLast(iteratee?: ArrayPredicate<T>): ExplicitValue1<T>;
        flatMap<TResult>(iteratee?: Iteratee<(value: T, index: number) => TResult[]>): ExplicitArray1<TResult>;
        includes(value: T, fromIndex?: number): ExplicitValue1<boolean>;
        invokeMap<TResult>(path: PathLocation | Function, ...args: any[]): ExplicitArray1<TResult>;
        keyBy(iteratee?: ValuePredicate<T>): ExplicitValue1<{ [index: string]: T; }>;
        map<TResult>(iteratee?: Iteratee<(value: T, index: number) => TResult>): ExplicitArray1<TResult>;
        groupBy(iteratee: ValuePredicate<T>): ExplicitValue1<{ [index: string]: T; }>;
        partition(iteratee?: ValuePredicate<T>): ExplicitValue1<[T[], T[]]>;
        reduce<TAcc>(iteratee?: AccumulatorArrayPredicate<T, TAcc>): ExplicitValue1<TAcc>;
        reduceRight<TAcc>(iteratee?: AccumulatorArrayPredicate<T, TAcc>): ExplicitValue1<TAcc>;
        reject(iteratee?: ArrayPredicate<T>): TWrapper;
        sample(): ExplicitValue1<T>;
        size(): ExplicitValue1<number>;
        some(iteratee?: ArrayPredicate<T>): ExplicitValue1<boolean>;
    }

    interface ObjectWrapper<T, TObj extends { [index: string]: T }, TWrapper> {
        forEach: ForEachObject<T, TWrapper>;
        forEachRight: ForEachObject<T, TWrapper>;
        each: ForEachObject<T, TWrapper>;
        eachRight: ForEachObject<T, TWrapper>;
    }

    interface ImplicitObject<T, TObj extends { [index: string]: T }, TWrapper extends ImplicitObject<T, TObj, TWrapper>> {
        orderBy: OrderBy<T, ImplicitArray1<T>>;
        shuffle: Shuffle<ImplicitArray1<T>>;
        sampleSize(n?: number): ImplicitArray1<T>;
        sortBy: SortBy<T, ImplicitArray1<T>>;
    }

    interface ExplicitObject<T, TObj extends { [index: string]: T }, TWrapper extends ExplicitObject<T, TObj, TWrapper>> {
        orderBy: OrderBy<T, ExplicitArray1<T>>;
        shuffle: Shuffle<ExplicitArray1<T>>;
        sampleSize(n?: number): ExplicitArray1<T>;
        sortBy: SortBy<T, ExplicitArray1<T>>;
    }
}
namespace Types {
    interface CountBy {
        <T>(collection: ArrayLike<T>, iteratee: ValuePredicate<T>): { [index: string]: number; };
        <T>(collection: _Obj<T>, iteratee: ValuePredicate<T>): { [index: string]: number; };
    }

    interface GroupBy {
        <T>(collection: ArrayLike<T>, iteratee: ValuePredicate<T>): { [index: string]: T; };
        <T>(collection: _Obj<T>, iteratee: ValuePredicate<T>): { [index: string]: any; };
    }

    interface ByBooleanPredicate {
        <T>(collection: ArrayLike<T>, iteratee?: ArrayPredicate<T, ArrayLike<T>>): boolean;
        <T>(collection: _Obj<T>, iteratee?: ObjectPredicate<T, _Obj<T>>): boolean;
    }

    interface ByArrayPredicate {
        <T>(collection: ArrayLike<T>, iteratee?: ArrayPredicate<T, ArrayLike<T>>): T[];
        <T>(collection: _Obj<T>, iteratee?: ObjectPredicate<T, _Obj<T>>): T[];
    }

    interface ResultPredicate {
        <T>(collection: ArrayLike<T>, iteratee?: ArrayPredicate<T, ArrayLike<T>>): T;
        <T>(collection: _Obj<T>, iteratee?: ObjectPredicate<T, _Obj<T>>): T;
    }

    interface FlatMap {
        <T, TResult>(collection: ArrayLike<T>, iteratee?: Iteratee<(value: T, index: number, collection: ArrayLike<T>) => TResult[]>): TResult[];
        <T, TResult>(collection: _Obj<T>, iteratee?: Iteratee<(value: T, index: string, collection: _Obj<T>) => TResult[]>): TResult[];
    }

    interface ForEach {
        <T>(collection: ArrayLike<T>, iteratee?: Iteratee<(value: T, index: number, collection: ArrayLike<T>) => boolean | void>): ArrayLike<T>;
        <T>(collection: _Obj<T>, iteratee?: Iteratee<(value: T, index: string, collection: _Obj<T>) => boolean | void>): _Obj<T>;
    }

    interface Includes {
        (collection: string, value: string, fromIndex?: number): boolean;
        <T>(collection: ArrayLike<T>, value: T, fromIndex?: number): boolean;
        <T>(collection: _Obj<T>, value: any, fromIndex?: number): boolean;
    }

    interface InvokeMap {
        <TResult>(collection: ArrayLike<any> | _Obj<any>, path: PathLocation | Function, ...args: any[]): TResult[];
    }

    interface KeyBy {
        <T>(collection: ArrayLike<T> | _Obj<T>, iteratee?: ValuePredicate<T>): { [index: string]: T; };
    }

    interface Map {
        <T, TResult>(collection: ArrayLike<T>, iteratee?: Iteratee<(value: T, index: number, collection: ArrayLike<T>) => TResult>): TResult[];
        <T, TResult>(collection: _Obj<T>, iteratee?: Iteratee<(value: T, index: string, collection: _Obj<T>) => TResult>): TResult[];
    }

    interface OrderBy {
        <T>(collection: ArrayLike<T>, iteratee?: ValuePredicate<T> | ValuePredicate<T>[], orders?: ("asc" | "desc") | ("asc" | "desc")[]): T[];
        <T>(collection: _Obj<T>, iteratee?: ValuePredicate<T> | ValuePredicate<T>[], orders?: ("asc" | "desc") | ("asc" | "desc")[]): T[];
    }

    interface Partition {
        <T>(collection: ArrayLike<T>, iteratee?: ValuePredicate<T>): [T[], T[]];
        <T>(collection: _Obj<T>, iteratee?: ValuePredicate<T>): [T[], T[]];
    }

    interface Reduce {
        <T, TAcc>(collection: ArrayLike<T>, iteratee?: AccumulatorArrayPredicate<T, ArrayLike<T>, TAcc>): TAcc;
        <T, TAcc>(collection: _Obj<T>, iteratee?: AccumulatorObjectPredicate<T, _Obj<T>, TAcc>): TAcc;
    }

    interface Sample {
        <T>(collection: ArrayLike<T> | _Obj<T>): T;
    }

    interface SampleSize {
        <T>(collection: ArrayLike<T> | _Obj<T>, n?: number): T[];
    }

    interface Shuffle {
        <T>(collection: ArrayLike<T> | _Obj<T>): T[];
    }

    interface Size {
        <T>(collection: ArrayLike<T> | _Obj<T>): number;
    }

    interface SortBy {
        <T>(collection: ArrayLike<T>, iteratee?: ValuePredicate<T> | ValuePredicate<T>[]): T[];
        <T>(collection: _Obj<T>, iteratee?: ValuePredicate<T> | ValuePredicate<T>[]): T[];
    }
}

interface IStatic {
    countBy: Types.CountBy;
    every: Types.ByBooleanPredicate;
    filter: Types.ByArrayPredicate;
    find: Types.ResultPredicate;
    findLast: Types.ResultPredicate;
    flatMap: Types.FlatMap;
    forEach: Types.ForEach;
    forEachRight: Types.ForEach;
    each: Types.ForEach;
    eachRight: Types.ForEach;
    keyBy: Types.KeyBy;
    groupBy: Types.GroupBy;
    includes: Types.Includes;
    invokeMap: Types.InvokeMap;
    map: Types.Map;
    orderBy: Types.OrderBy;
    partition: Types.Partition;
    reduce: Types.Reduce;
    reduceRight: Types.Reduce;
    reject: Types.ByArrayPredicate;
    sample: Types.Sample;
    sampleSize: Types.SampleSize;
    shuffle: Types.Shuffle;
    size: Types.Size;
    some: Types.ByBooleanPredicate;
    sortBy: Types.SortBy;
}
namespace Types {
    interface Identity {
        <T>(value: T, ...args: any[]): T;
    }

    type Iteratee<T extends Function> = string | Object | T;
    type PathLocation = string | string[];

    type _Obj<T> = { [index: string]: T; };
    type ArrayPredicate<T, TArray extends ArrayLike<T>> = Iteratee<(value: T, index: number, collection: TArray) => boolean>;
    type AccumulatorArrayPredicate<T, TArray extends ArrayLike<T>, TAcc> = Iteratee<(accumulator: TAcc, value: T, index: number, collection: TArray) => TAcc>;

    type ObjectPredicate<T, TObj extends _Obj<T>> = Iteratee<(value: T, index: string, collection: TObj) => boolean>;
    type AccumulatorObjectPredicate<T, TObj extends _Obj<T>, TAcc> = Iteratee<(accumulator: TAcc, value: T, index: string, collection: TObj) => TAcc>;

    type ValuePredicate<T> = Iteratee<(value: T) => string>;

    namespace Wrap {
        type ArrayPredicate<T> = Iteratee<(value: T, index: number) => boolean>;
        type AccumulatorArrayPredicate<T, TAcc> = Iteratee<(accumulator: TAcc, value: T, index: number) => TAcc>;

        type ObjectPredicate<T> = Iteratee<(value: T, index: string) => boolean>;
        type AccumulatorObjectPredicate<T, TAcc> = Iteratee<(accumulator: TAcc, value: T, index: string) => TAcc>;
    }
}
type MemoizedFunction = { cache: {
    delete(key: string): boolean;
    get(key: string): any;
    has(key: string): boolean;
    set(key: string, value: any): any;
} };

namespace Types {
    type AfterMethod = <T extends Function>(num: number, func: T) => T;
    type ReturnMethod = <T extends Function>(func: T) => T;
    interface PH {
        _placeholder: any;
    }
    interface ReplacementPlaceholder {
        placeholder: PH;
    }

    interface DebounceOptions {
        leading?: boolean;
        maxWait?: number;
        trailing?: boolean;
    }

    interface ThrottleOptions {
        leading?: boolean;
        trailing?: boolean;
    }

    interface Defer {
        <T>(func: (t1: T) => any, t1: T): number;
        <T, T2>(func: (t1: T, t2: T2) => any, t1: T, t2: T2): number;
        <T, T2, T3>(func: (t1: T, t2: T2, t3: T3) => any, t1: T, t2: T2, t3: T3): number;
        <T, T2, T3, T4>(func: (t1: T, t2: T2, t3: T3, t4: T4) => any, t1: T, t2: T2, t3: T3, t4: T4): number;
        <T, T2, T3, T4, T5>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => any, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): number;
        <T extends Function>(func: T, ...args: any[]): number;
    }

    interface Delay {
        <T>(func: (t1: T) => any, wait: number, t1: T): number;
        <T, T2>(func: (t1: T, t2: T2) => any, wait: number, t1: T, t2: T2): number;
        <T, T2, T3>(func: (t1: T, t2: T2, t3: T3) => any, wait: number, t1: T, t2: T2, t3: T3): number;
        <T, T2, T3, T4>(func: (t1: T, t2: T2, t3: T3, t4: T4) => any, wait: number, t1: T, t2: T2, t3: T3, t4: T4): number;
        <T, T2, T3, T4, T5>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => any, wait: number, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): number;
        <T extends Function>(func: T, wait?: number, ...args: any[]): number;
    }

    interface Flip {
        <T, TResult>(func: (t1: T) => TResult): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult): (t2: T2, t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult): (t3: T3, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult): (t4: T4, t3: T3, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult): (t5: T5, t4: T4, t3: T3, t2: T2, t1: T) => TResult;
        <TResult extends Function>(func: Function): TResult;
    }
    
    interface Memoize {
        Cache: {
            delete(key: string): boolean;
            get(key: string): any;
            has(key: string): boolean;
            set(key: string, value: any): any;
        };
        <T extends Function>(func: T, resolver?: Function): T & MemoizedFunction;
    }

    interface Negate {
        <T, TResult>(func: (t1: T) => TResult): (t1: T) => boolean;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult): (t1: T, t2: T2) => boolean;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult): (t1: T, t2: T2, t3: T3) => boolean;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult): (t1: T, t2: T2, t3: T3, t4: T4) => boolean;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult): (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => boolean;
        (func: (...args: any[]) => any): (...args: any[]) => boolean;
    }

    interface OverArgs {
        <T, TResult>(func: (t1: T) => TResult, t1: (t1: T) => T): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t1: (t1: T) => T, t2: (t2: T2) => T2): (t1: T, t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: (t1: T) => T, t2: (t2: T2) => T2, t3: (t3: T3) => T3): (t1: T, t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: (t1: T) => T, t2: (t2: T2) => T2, t3: (t3: T3) => T3, t4: (t4: T4) => T4): (t1: T, t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: (t1: T) => T, t2: (t2: T2) => T2, t3: (t3: T3) => T3, t4: (t4: T4) => T4, t5: (t5: T5) => T5): (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult;
        <T extends Function>(func: T, ...args: any[]): T;
    }

    interface Rest {
        <T, TArg, TResult>(func: (t1: T, args: TArg[]) => TResult): (t1: T, ...args: TArg[]) => TResult;
        <T, T2, TArg, TResult>(func: (t1: T, t2: T2, args: TArg[]) => TResult): (t1: T, t2: T2, ...args: TArg[]) => TResult;
        <T, T2, T3, TArg, TResult>(func: (t1: T, t2: T2, t3: T3, args: TArg[]) => TResult): (t1: T, t2: T2, t3: T3, ...args: TArg[]) => TResult;
        <T, T2, T3, T4, TArg, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, args: TArg[]) => TResult): (t1: T, t2: T2, t3: T3, t4: T4, ...args: TArg[]) => TResult;
        <T, T2, T3, T4, T5, TArg, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5, args: TArg[]) => TResult): (t1: T, t2: T2, t3: T3, t4: T4, t5: T5, ...args: TArg[]) => TResult;
        <T extends Function>(func: Function, start?: number): T;
    }

    interface Spread {
        <T, TResult>(func: (args: T[]) => TResult): (...args: T[]) => TResult;
        <T extends Function>(func: Function, start?: number): T;
    }

    interface Unary {
        <T, TResult>(func: (t1: T) => TResult): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult): (t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult): (t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult): (t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult): (t1: T) => TResult;
        <TResult extends Function>(func: Function): TResult;
    }

    interface Bind {
        <T, TResult>(func: (t1: T) => TResult, thisArg: any): (t1: T) => TResult;
        <T, TResult>(func: (t1: T) => TResult, thisArg: any, t1: T): () => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, thisArg: any): (t1: T, t2: T2) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, thisArg: any, t1: PH, t2: T2): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, thisArg: any, t1: T): (t2: T2) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, thisArg: any, t1: T, t2: T2): () => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: PH, t2: T2): (t1: T, t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3): (t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: T, t2: PH, t3: T3): (t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any): (t1: T, t2: T2, t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: T): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: T, t2: T2): (t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, thisArg: any, t1: T, t2: T2, t3: T3): () => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: PH, t3: PH, t4: T4): (t1: T, t2: T2, t3: PH) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3, t4: T4): (t1: T, t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: T2, t3: PH, t4: T4): (t1: T, t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: PH, t3: PH, t4: T4): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: T2): (t1: T, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3): (t1: T, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: PH, t3: T3): (t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3, t4: T4): (t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: PH, t3: T3, t4: T4): (t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: T2, t3: PH, t4: T4): (t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any): (t1: T, t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T): (t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: T2): (t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: T2, t3: T3): (t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, thisArg: any, t1: T, t2: T2, t3: T3, t4: T4): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2): (t1: T, t3: T3, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: T3): (t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3): (t1: T, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: T3): (t2: T2, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: PH, t4: T4): (t2: T2, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: PH, t4: T4): (t1: T, t2: T2, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3, t4: T4): (t1: T, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3, t4: T4): (t1: T, t2: T2, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: PH, t4: T4): (t1: T, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: T3, t4: T4): (t2: T2, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: PH, t4: T4): (t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: T3, t4: T4): (t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: PH, t4: PH, t5: T5): (t1: T, t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: PH, t4: T4, t5: T5): (t1: T, t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3, t4: PH, t5: T5): (t1: T, t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: PH, t4: PH, t5: T5): (t1: T, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: PH, t4: PH, t5: T5): (t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: PH, t3: T3, t4: T4, t5: T5): (t1: T, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: PH, t4: T4, t5: T5): (t1: T, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3, t4: PH, t5: T5): (t1: T, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: PH, t4: T4, t5: T5): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: T3, t4: PH, t5: T5): (t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: PH, t4: PH, t5: T5): (t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: PH, t2: T2, t3: T3, t4: T4, t5: T5): (t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: PH, t3: T3, t4: T4, t5: T5): (t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: PH, t4: T4, t5: T5): (t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: T3, t4: PH, t5: T5): (t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T, t2: T2): (t3: T3, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, thisArg: any, t1: T): (t2: T2, t3: T3, t4: T4, t5: T5) => TResult;
        <TResult extends Function>(func: Function, thisArg: any, ...args: any[]): TResult;
    }

    interface Partial {
        <T, TResult>(func: (t1: T) => TResult, t1: T): () => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t1: PH, t2: T2): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t1: T): (t2: T2) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t1: T, t2: T2): () => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: PH, t2: T2): (t1: T, t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: PH, t2: T2, t3: T3): (t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: T, t2: PH, t3: T3): (t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: T): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: T, t2: T2): (t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: T, t2: T2, t3: T3): () => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: PH, t3: PH, t4: T4): (t1: T, t2: T2, t3: PH) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: PH, t3: T3, t4: T4): (t1: T, t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: T2, t3: PH, t4: T4): (t1: T, t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: PH, t3: PH, t4: T4): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: T2): (t1: T, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: T2, t3: T3): (t1: T, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: PH, t3: T3): (t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: PH, t2: T2, t3: T3, t4: T4): (t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: PH, t3: T3, t4: T4): (t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: T2, t3: PH, t4: T4): (t3: T3) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T): (t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: T2): (t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: T2, t3: T3): (t4: T4) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: T2, t3: T3, t4: T4): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2): (t1: T, t3: T3, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: T3): (t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: T3): (t1: T, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: T3): (t2: T2, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: T3): (t1: T, t2: T2, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: PH, t4: T4): (t2: T2, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: PH, t4: T4): (t1: T, t2: T2, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: T3, t4: T4): (t1: T, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: T3, t4: T4): (t1: T, t2: T2, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: PH, t4: T4): (t1: T, t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: T3, t4: T4): (t2: T2, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: PH, t4: T4): (t3: T3, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: T3, t4: T4): (t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: PH, t4: PH, t5: T5): (t1: T, t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: PH, t4: T4, t5: T5): (t1: T, t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: T3, t4: PH, t5: T5): (t1: T, t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: PH, t4: PH, t5: T5): (t1: T, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: PH, t4: PH, t5: T5): (t2: T2, t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: PH, t3: T3, t4: T4, t5: T5): (t1: T, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: PH, t4: T4, t5: T5): (t1: T, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: T3, t4: PH, t5: T5): (t1: T, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: PH, t4: T4, t5: T5): (t2: T2, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: T3, t4: PH, t5: T5): (t2: T2, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: PH, t4: PH, t5: T5): (t3: T3, t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: PH, t2: T2, t3: T3, t4: T4, t5: T5): (t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: PH, t3: T3, t4: T4, t5: T5): (t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: PH, t4: T4, t5: T5): (t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: T3, t4: PH, t5: T5): (t4: T4) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2): (t3: T3, t4: T4, t5: T5) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T): (t2: T2, t3: T3, t4: T4, t5: T5) => TResult;
        <TResult extends Function>(func: Function, ...args: any[]): TResult;
    }

    interface PartialRight {
        <T, TResult>(func: (t1: T) => TResult, t1: T): () => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t2: PH, t1: T): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t2: T2): (t1: T) => TResult;
        <T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t2: T2, t1: T): () => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: PH, t2: PH, t1: T): (t3: T3, t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: PH, t2: T2): (t3: T3, t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: PH, t2: T2, t1: T): (t3: T3) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: T3, t2: PH, t1: T): (t2: T2) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: T3): (t2: T2, t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: T3, t2: T2): (t1: T) => TResult;
        <T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t3: T3, t2: T2, t1: T): () => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t3: PH, t2: PH, t1: T): (t4: T, t2: T2, t3: PH) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t3: PH, t2: T2, t1: T): (t4: T, t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t2: T2, t3: PH, t1: T): (t4: T, t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t3: PH, t2: T2): (t4: T, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t3: PH, t2: PH, t1: T): (t3: T3, t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t2: T2): (t4: T, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t3: T3, t2: T2): (t4: T, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t3: PH, t2: T2): (t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: PH, t3: T3, t2: T2, t1: T): (t4: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t3: PH, t2: T2, t1: T): (t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t2: T2, t3: PH, t1: T): (t2: T2) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T): (t3: T3, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t2: T2): (t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t3: T3, t2: T2): (t1: T) => TResult;
        <T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t4: T, t3: T3, t2: T2, t1: T): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4): (t5: T5, t3: T3, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: T3): (t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: T3): (t5: T5, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: T3): (t4: T4, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: T3): (t5: T5, t4: T4, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: PH, t2: T2): (t4: T4, t3: T3, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: PH, t2: T2): (t5: T5, t4: T4, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: T3, t2: T2): (t5: T5, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: T3, t2: T2): (t5: T5, t4: T4, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: PH, t2: T2): (t3: T3, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: T3, t2: T2): (t4: T4, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: PH, t2: T2): (t3: T3, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: T3, t2: T2): (t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: PH, t2: PH, t1: T): (t5: T5, t4: T4, t3: T3, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: PH, t2: T2, t1: T): (t5: T5, t4: T4, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: T3, t2: PH, t1: T): (t5: T5, t4: T4, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: PH, t2: PH, t1: T): (t5: T5, t3: T3, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: PH, t2: PH, t1: T): (t4: T4, t3: T3, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: PH, t3: T3, t2: T2, t1: T): (t5: T5, t4: T4, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: PH, t2: T2, t1: T): (t5: T5, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: T3, t2: PH, t1: T): (t5: T5, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: PH, t2: T2, t1: T): (t4: T4, t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: T3, t2: PH, t1: T): (t4: T4, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: PH, t2: PH, t1: T): (t3: T3, t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: PH, t4: T4, t3: T3, t2: T2, t1: T): (t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: PH, t3: T3, t2: T2, t1: T): (t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: PH, t2: T2, t1: T): (t3: T3) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: T3, t2: PH, t1: T): (t2: T2) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4, t3: T3, t2: T2, t1: T): () => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5, t4: T4): (t3: T3, t2: T2, t1: T) => TResult;
        <T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t5: T5): (t4: T4, t3: T3, t2: T2, t1: T) => TResult;
        <TResult extends Function>(func: Function, ...args: any[]): TResult;
    }

    interface CurriedFunction1<T1, R> {
        (): CurriedFunction1<T1, R>;
        (t1: T1): R;
    }

    interface CurriedFunction2<T1, T2, R> {
        (): CurriedFunction2<T1, T2, R>;
        (t1: T1): CurriedFunction1<T2, R>;
        (t1: T1, t2: T2): R;
    }

    interface CurriedFunction3<T1, T2, T3, R> {
        (): CurriedFunction3<T1, T2, T3, R>;
        (t1: T1): CurriedFunction2<T2, T3, R>;
        (t1: T1, t2: T2): CurriedFunction1<T3, R>;
        (t1: T1, t2: T2, t3: T3): R;
    }

    interface CurriedFunction4<T1, T2, T3, T4, R> {
        (): CurriedFunction4<T1, T2, T3, T4, R>;
        (t1: T1): CurriedFunction3<T2, T3, T4, R>;
        (t1: T1, t2: T2): CurriedFunction2<T3, T4, R>;
        (t1: T1, t2: T2, t3: T3): CurriedFunction1<T4, R>;
        (t1: T1, t2: T2, t3: T3, t4: T4): R;
    }

    interface CurriedFunction5<T1, T2, T3, T4, T5, R> {
        (): CurriedFunction5<T1, T2, T3, T4, T5, R>;
        (t1: T1): CurriedFunction4<T2, T3, T4, T5, R>;
        (t1: T1, t2: T2): CurriedFunction3<T3, T4, T5, R>;
        (t1: T1, t2: T2, t3: T3): CurriedFunction2<T4, T5, R>;
        (t1: T1, t2: T2, t3: T3, t4: T4): CurriedFunction1<T5, R>;
        (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
    }

    interface Curry {
        <T1, R>(func: (t1: T1) => R): CurriedFunction1<T1, R>;
        <T1, T2, R>(func: (t1: T1, t2: T2) => R): CurriedFunction2<T1, T2, R>;
        <T1, T2, T3, R>(func: (t1: T1, t2: T2, t3: T3) => R): CurriedFunction3<T1, T2, T3, R>;
        <T1, T2, T3, T4, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4) => R): CurriedFunction4<T1, T2, T3, T4, R>;
        <T1, T2, T3, T4, T5, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R): CurriedFunction5<T1, T2, T3, T4, T5, R>;
        <TResult extends Function>(func: Function, arity?: number): TResult;
    }

    interface CurryRight {
        <T1, R>(func: (t1: T1) => R): CurriedFunction1<T1, R>;
        <T1, T2, R>(func: (t1: T1, t2: T2) => R): CurriedFunction2<T2, T1, R>;
        <T1, T2, T3, R>(func: (t1: T1, t2: T2, t3: T3) => R): CurriedFunction3<T3, T2, T1, R>;
        <T1, T2, T3, T4, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4) => R): CurriedFunction4<T4, T3, T2, T1, R>;
        <T1, T2, T3, T4, T5, R>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R): CurriedFunction5<T5, T4, T3, T2, T1, R>;
        <TResult extends Function>(func: Function, arity?: number): TResult;
    }

    interface Rearg {
        <TResult extends Function>(func: Function, indexes: number[]): TResult;
        <TResult extends Function>(func: Function, ...indexes: number[]): TResult;
    }
}

interface IStatic {
    after: Types.AfterMethod;
    ary<T extends Function>(func: T, num?: number): T
    before: Types.AfterMethod;
    bind: Types.Bind;
    bindKey<TResult extends Function>(object: Object, key: string, ...partials: any[]): TResult
    curry: Types.Curry;
    curryRight: Types.CurryRight;
    debounce<T extends Function>(func: T, wait?: number, options?: Types.DebounceOptions): T
    defer: Types.Defer;
    delay: Types.Delay;
    flip: Types.Flip;
    memoize: Types.Memoize;
    negate: Types.Negate;
    once: Types.ReturnMethod;
    overArgs: Types.OverArgs;
    partial: Types.Partial;
    partialRight: Types.PartialRight;
    rearg: Types.Rearg;
    rest: Types.Rest;
    spread: Types.Spread;
    throttle<T extends Function>(func: T, wait?: number, options?: Types.ThrottleOptions): T
    unary: Types.Unary;
    wrap<TResult>(value: any, wrapper: Function): TResult
}
namespace Types {
    interface CastArray {
        <T>(value: T[]): T[];
        <T>(value: T): T[];
    }

    interface Clone {
        <T>(value: T): T;
    }

    interface CloneWith {
        <T>(value: T): T;
        <T, TResult>(value: T, customizer: (value: any, key: string, object: T, stack: any) => any): TResult;
    }

    interface Comparison {
        <T>(a: T, b: T): boolean;
    }
}

interface IStatic {
    castArray: Types.CastArray;
    clone: Types.Clone;
    cloneDeep: Types.Clone;
    cloneWith: Types.CloneWith;
    cloneDeepWith: Types.CloneWith;
    eq: Types.Comparison;
    gt: Types.Comparison;
    gte: Types.Comparison;
    lt: Types.Comparison;
    lte: Types.Comparison;
    isArguments(value: any): value is IArguments
    isArray(value: any): value is any[]
    isArray<T>(value: any): value is T[]
    isArrayBuffer(value: any): value is ArrayBuffer
    isArrayLike(value: any): value is ArrayLike<any>
    isArrayLike<T>(value: any): value is ArrayLike<T>
    isArrayLikeObject(value: any): value is ArrayLike<any>
    isArrayLikeObject<T>(value: any): value is ArrayLike<T> & Object
    isBoolean(value: any): value is boolean | Boolean
    isBuffer(value: any): boolean // buffer signature?
    isDate(value: any): value is Date
    isElement<T extends Element>(value: any): value is T
    isEmpty(value: any): boolean
    isEqual: Types.Comparison;
    isEqualWith<T>(a: T, b: T, customizer: (valueA: any, valueB: any, key: string, a: T, b: T, stack: any) => any): boolean
    isError<T extends Error>(value: any): value is T
    isFinite(value: number): boolean
    isFunction<T extends Function>(value: any): value is T
    isInteger(value: number): boolean
    isLength(value: number): boolean
    isMap<K, V>(value: any): value is Map<K, V>
    isMatch<T extends R, R>(value: T, match: R): boolean
    isMatchWith<T, R>(value: T, source: R, customizer: (valueA: any, valueB: any, key: string, a: T, b: R) => any): boolean
    isNaN(value: number): boolean
    isNative<T extends Function>(value: T): boolean
    isNil(value: any): boolean
    isNull(value: any): boolean
    isNumber(value: any): value is number
    isObject<T extends Object>(value: any): value is T
    isObjectLike<T extends Object>(value: any): value is T
    isPlainObject<T extends Object>(value: any): value is T
    isRegExp(value: any): value is RegExp
    isSafeInteger(value: number): boolean
    isSet<T>(value: any): value is Set<T>
    isString(value: any): value is string
    isSymbol(value: any): value is Symbol
    isTypedArray(value: any): boolean
    isUndefined(value: any): boolean
    isWeakMap<K, V>(value: any): value is WeakMap<K, V>
    isWeakSet<T>(value: any): value is WeakSet<T>
    toArray<T>(value: { [index: string]: T }): T[]
    toArray(value: string): string[]
    toArray<T>(value: T[]): T[]
    toArray<T>(value: any): T[]
    toInteger(value: number | string): number
    toLength(value: number): number
    toNumber(value: any): number
    toPlainObject<T extends Object>(value: any): T
    toSafeInteger(value: number | string): number
    toString(value: any): string
}
namespace Types {
    type Add = (augend: number, addend: number) => number;
    type Max = (array: number[]) => number;
    type Ceil = (n: number, precision?: number) => number;
    interface MaxBy {
        <T>(array: T[]): T;
        <T>(array: T[], iteratee: (value: T) => number): T;
        <T>(array: T[], iteratee: PathLocation): T;
        <T>(array: T[], iteratee: any): T;
    }
}

interface IStatic {
    add: Types.Add;
    ceil: Types.Ceil;
    floor: Types.Ceil;
    max: Types.Max;
    maxBy: Types.MaxBy;
    mean: Types.Max;
    min: Types.Max;
    minBy: Types.MaxBy;
    round: Types.Ceil;
    subtract: Types.Add;
    sum: Types.Max;
    sumBy: Types.MaxBy;
    clamp(num: number, upper: number): number
    clamp(num: number, lower: number, upper: number): number
    inRange(num: number, end: number): boolean
    inRange(num: number, start: number, end: number): boolean
    random(lower?: number, upper?: number, floating?: boolean): number
}
namespace Types {
    interface Assign {
        <TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
        <TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;
        <TObject, TSource1, TSource2, TSource3>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3): TObject & TSource1 & TSource2 & TSource3;
        <TObject, TSource1, TSource2, TSource3, TSource4>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4): TObject & TSource1 & TSource2 & TSource3 & TSource4;
        <TObject>(object: TObject): TObject;
        <TResult>(...otherArgs: any[]): TResult;
    }

    type AssignCustomizer = (objectValue: any, sourceValue: any, key?: string, object?: {}, source?: {}) => any;

    interface AssignWith {
        <TObject, TSource, TResult>(object: TObject, source: TSource, customizer: AssignCustomizer): TResult;
        <TObject, TSource1, TSource2, TResult>(object: TObject, source1: TSource1, source2: TSource2, customizer: AssignCustomizer): TResult;
        <TObject, TSource1, TSource2, TSource3, TResult>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, customizer: AssignCustomizer): TResult;
        <TObject, TSource1, TSource2, TSource3, TSource4, TResult>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4, customizer: AssignCustomizer): TResult;
        <TObject>(object: TObject): TObject;
        <TObject, TResult>(object: TObject, ...otherArgs: any[]): TResult;
    }

    interface At {
        <TResult>(obj: { [index: string]: any; }, paths: PathLocation[]): TResult[];
        <TResult>(obj: { [index: string]: any; }, ...paths: PathLocation[]): TResult[];
        <TResult>(obj: { [index: number]: any; }, paths: (number | number[])[]): TResult[];
        <TResult>(obj: { [index: number]: any; }, ...paths: (number | number[])[]): TResult[];
    }

    interface FindKey {
        <T>(obj: _Obj<T>, iteratee?: ObjectPredicate<T, _Obj<T>>): string;
    }

    interface ForIn {
        <T>(obj: _Obj<T>, iteratee?: Iteratee<(value: T, index: number, collection: _Obj<T>) => boolean | void>): _Obj<T>;
    }

    interface Functions {
        <TResult extends Function>(obj: _Obj<any>): TResult[];
    }

    interface Get {
        <TResult>(obj: Object, path: PathLocation, defaultValue?: TResult): TResult;
    }

    interface Has {
        (obj: Object, path: PathLocation): boolean;
    }

    interface InvertBy {
        <T>(obj: { [index: string]: T }, iteratee?: ValuePredicate<T>): { [index: string]: string[]; };
        <T>(obj: { [index: number]: T }, iteratee?: ValuePredicate<T>): { [index: string]: number[]; };
    }

    interface Invoke {
        <TResult>(obj: Object, path: PathLocation, ...args: any[]): TResult[];
    }

    interface Keys {
        (obj: Object): string[];
    }

    interface MapKeys {
        <T>(obj: _Obj<T>, iteratee?: Iteratee<(value: T, index: string, collection: _Obj<T>) => string>): _Obj<T>;
    }

    interface MapValues {
        <T, TResult>(obj: _Obj<T>, iteratee?: Iteratee<(value: T, index: string, collection: _Obj<T>) => TResult>): _Obj<Rest>;
    }

    interface Omit {
        <TResult>(obj: Object, props?: string | string[]): TResult;
        <TResult>(obj: Object, ...props: string[]): TResult;
    }

    interface OmitBy {
        <T, TResult>(obj: _Obj<T>, predicate?: Iteratee<(value: T, key: string) => boolean>): TResult;
    }

    interface Set {
        <T, TObj>(obj: TObj, path: PathLocation, value: T): TObj;
    }

    interface SetWith {
        <T, TObj>(obj: TObj, path: PathLocation, value: T, customizer?: (nsValue: T, key: string, nsObject: TObj) => any): TObj;
    }

    interface ToPairs {
        <T>(obj: { [index: number]: T }): [number, T][];
        <T>(obj: { [index: string]: T }): [string, T][];
    }

    interface Transform {
        <T, TObj, TAcc>(obj: TObj, iteratee?: Iteratee<(acc: TAcc, value: any, key: string, obj: TObj) => any>): TAcc;
    }

    interface Unset {
        (obj: Object, path: PathLocation): boolean;
    }

    interface Values {
        <T>(obj: { [index: string]: T; }): T[];
        <T>(obj: { [index: number]: T; }): T[];
    }
}

interface IStatic {
    assign: Types.Assign;
    assignIn: Types.Assign;
    assignWith: Types.AssignWith;
    assignInWith: Types.AssignWith;
    at: Types.At;
    create<T, P>(prototype: T, properties?: P): T & P
    create<TResult>(prototype: any, properties?: any): TResult
    defaults: Types.Assign;
    defaultsDeep: Types.Assign;
    extend: Types.Assign;
    findKey: Types.FindKey;
    findLastKey: Types.FindKey;
    forIn: Types.ForIn;
    forInRight: Types.ForIn;
    forOwn: Types.ForIn;
    forOwnRight: Types.ForIn;
    functions: Types.Functions;
    functionsIn: Types.Functions;
    get: Types.Get;
    has: Types.Has;
    hasIn: Types.Has;
    invert<TResult>(obj: Object): TResult
    invoke: Types.Invoke;
    keys: Types.Keys;
    keysIn: Types.Keys;
    mapKeys: Types.MapKeys;
    merge: Types.Assign;
    mergeWith: Types.AssignWith;
    omit: Types.Omit;
    omitBy: Types.OmitBy;
    pick: Types.Omit;
    pickBy: Types.OmitBy;
    result: Types.Get;
    set: Types.Set;
    setWith: Types.SetWith;
    toPairs: Types.ToPairs;
    toPairsIn: Types.ToPairs;
    transform: Types.Transform;
    unset: Types.Unset;
    values: Types.Values;
    valuesIn: Types.Values;
}
namespace Types {
    type StringMethod = (str?: string) => string;
    type WithStringMethod = (str?: string, target?: string, position?: number) => boolean;
    type PadStringMethod = (str?: string, length?: number, chars?: string) => string;
    type TrimStringMethod = (str?: string, chars?: string) => string;

    interface TemplateSettings {
        escape?: RegExp;
        evaluate?: RegExp;
        imports?: { [index: string]: any; };
        interpolate?: RegExp;
        variable?: string;
    }

    interface TemplateOptions extends TemplateSettings {
        sourceURL?: string;
    }

    interface TruncateOptions {
        length?: number;
        omission?: string;
        separator?: string | RegExp;
    }
}

interface IStatic {
    templateSettings: Types.TemplateSettings;
    VERSION: string;

    camelCase: Types.StringMethod;
    capitalize: Types.StringMethod;
    deburr: Types.StringMethod;
    endsWith: Types.WithStringMethod;
    escape: Types.StringMethod;
    escapeRegExp: Types.StringMethod;
    kebabCase: Types.StringMethod;
    lowerCase: Types.StringMethod;
    lowerFirst: Types.StringMethod;
    pad: Types.PadStringMethod;
    padEnd: Types.PadStringMethod;
    padStart: Types.PadStringMethod;
    parseInt(str: string, radix?: number): number
    repeat(str?: string, num?: number): string
    replace(str: string, pattern: RegExp | string, replacement: string | ((substring: string, ...args: any[]) => string)): string
    replace(pattern: RegExp | string, replacement: string | ((substring: string, ...args: any[]) => string)): string
    snakeCase: Types.StringMethod;
    split(str: string, separator: string | RegExp, limit?: number): string[]
    split(separator: string | RegExp, limit?: number): string[]
    startCase: Types.StringMethod;
    startsWith: Types.WithStringMethod;
    template<T>(str?: string, options?: Types.TemplateOptions): (ctx: T) => string
    toLower: Types.StringMethod;
    toUpper: Types.StringMethod;
    trim: Types.TrimStringMethod;
    trimEnd: Types.TrimStringMethod;
    trimStart: Types.TrimStringMethod;
    truncate(str?: string, options?: Types.TruncateOptions): string
    unescape: Types.StringMethod;
    upperCase: Types.StringMethod;
    upperFirst: Types.StringMethod;
    words(str?: string, pattern?: string | RegExp): string[]
}
namespace Types {
    interface Flow {
        <T, V>(func?: (t1: T) => V, ...funcs: ((value: V) => V)[]): V;
        <T, T2, V>(func?: (t1: T, t2: T2) => V, ...funcs: ((value: V) => V)[]): V;
        <T, T2, T3, V>(func?: (t1: T, t2: T2, t3: T3) => V, ...funcs: ((value: V) => V)[]): V;
        <T, T2, T3, T4, V>(func?: (t1: T, t2: T2, t3: T3, t4: T4) => V, ...funcs: ((value: V) => V)[]): V;
        <T, T2, T3, T4, T5, V>(func?: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => V, ...funcs: ((value: V) => V)[]): V;
        <F extends Function, V>(func?: F, ...funcs: ((value: V) => V)[]): V;
        <V>(func?: Function, ...funcs: ((value: V) => V)[]): V;
        <V>(funcs: ((value: V) => V)[]): V;
    }

    interface IterateeMethod {
        <T extends Function>(func: T): T;
        <TResult>(value: string): (object: any) => TResult;
        (func: Object): (object: any) => boolean;
        (): Identity;
    }

    interface Over {
        <TResult>(s1: string): (object: any) => [string];
        <TResult>(s1: string, s2: string): (object: any) => [string, string];
        <TResult>(s1: string, s2: string, s3: string): (object: any) => [string, string, string];
        <TResult>(s1: string, s2: string, s3: string, s4: string): (object: any) => [string, string, string, string];
        <TResult>(s1: string, s2: string, s3: string, s4: string, s5: string): (object: any) => [string, string, string, string, string];
        <TResult>(...funcs: any[]): (...args: any[]) => TResult[];
        <TResult>(funcs: any[]): (...args: any[]) => TResult[];

        (o1: any): (object: any) => [boolean];
        (o1: any, o2: any): (object: any) => [boolean, boolean];
        (o1: any, o2: any, o3: any): (object: any) => [boolean, boolean, boolean];
        (o1: any, o2: any, o3: any, o4: any): (object: any) => [boolean, boolean, boolean, boolean];
        (o1: any, o2: any, o3: any, o4: any, o5: any): (object: any) => [boolean, boolean, boolean, boolean, boolean];

        <TResult>(...funcs: ((...args: any[]) => TResult)[]): (object: any) => TResult[];
        <TResult>(...funcs: string[]): (object: any) => TResult[];

        <TResult>(funcs: ((...args: any[]) => TResult)[]): (object: any) => TResult[];
        <TResult>(funcs: string[]): (object: any) => TResult[];
    }

    interface OverEveryORSome {
        <T>(...funcs: ((t1: T) => boolean)[]): (t1: T) => boolean;
        <T, T2>(...funcs: ((t1: T, t2: T2) => boolean)[]): (t1: T, t2: T2) => boolean;
        <T, T2, T3>(...funcs: ((t1: T, t2: T2, t3: T3) => boolean)[]): (t1: T, t2: T2, t3: T3) => boolean;
        <T, T2, T3, T4>(...funcs: ((t1: T, t2: T2, t3: T3, t4: T4) => boolean)[]): (t1: T, t2: T2, t3: T3, t4: T4) => boolean;
        <T, T2, T3, T4, T5>(...funcs: ((t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => boolean)[]): (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => boolean;
        (...funcs: ((...args: any[]) => boolean)[]): (object: any) => boolean;
        (...funcs: string[]): (object: any) => boolean;
        (...funcs: any[]): (object: any) => boolean;
        (funcs: ((...args: any[]) => boolean)[]): (object: any) => boolean;
        (funcs: string[]): (object: any) => boolean;
        (funcs: any[]): (object: any) => boolean;
    }

    interface Range {
        (start: number, end: number, step?: number): number[];
        (end: number, step?: number): number[];
    }

    interface Method {
        <T, TResult>(path: PathLocation, t1: T): (obj: any) => TResult;
        <T, T2, TResult>(path: PathLocation, t1: T, t2: T2): (obj: any) => TResult;
        <T, T2, T3, TResult>(path: PathLocation, t1: T, t2: T2, t3: T3): (obj: any) => TResult;
        <T, T2, T3, T4, TResult>(path: PathLocation, t1: T, t2: T2, t3: T3, t4: T4): (obj: any) => TResult;
        <T, T2, T3, T4, T5, TResult>(path: PathLocation, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): (obj: any) => TResult;
        <TResult>(path: PathLocation, ...args: any[]): (obj: any) => TResult;
    }

    interface MethodOf {
        <T, TResult>(obj: any, t1: T): (path: PathLocation) => TResult;
        <T, T2, TResult>(obj: any, t1: T, t2: T2): (path: PathLocation) => TResult;
        <T, T2, T3, TResult>(obj: any, t1: T, t2: T2, t3: T3): (path: PathLocation) => TResult;
        <T, T2, T3, T4, TResult>(obj: any, t1: T, t2: T2, t3: T3, t4: T4): (path: PathLocation) => TResult;
        <T, T2, T3, T4, T5, TResult>(obj: any, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): (path: PathLocation) => TResult;
        <TResult>(obj: any, ...args: any[]): (path: PathLocation) => TResult;
    }
}

interface IStatic {
    attempt<T, TResult>(func: (t1: T) => TResult, t1: T): TResult | Error
    attempt<T, T2, TResult>(func: (t1: T, t2: T2) => TResult, t1: T, t2: T2): TResult | Error
    attempt<T, T2, T3, TResult>(func: (t1: T, t2: T2, t3: T3) => TResult, t1: T, t2: T2, t3: T3): TResult | Error
    attempt<T, T2, T3, T4, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4) => TResult, t1: T, t2: T2, t3: T3, t4: T4): TResult | Error
    attempt<T, T2, T3, T4, T5, TResult>(func: (t1: T, t2: T2, t3: T3, t4: T4, t5: T5) => TResult, t1: T, t2: T2, t3: T3, t4: T4, t5: T5): TResult | Error
    attempt<TResult>(func: (...args: any[]) => TResult, ...args: any[]): TResult | Error

    bindAll<T>(object: T, ...methodNames: Types.PathLocation[]): T

    cond<T, TResult>(array: [(arg: T) => boolean, (arg: T) => TResult][]): TResult

    conforms<U, T extends { [index: string]: (obj: U) => boolean }>(arg: T): (arg: U) => boolean;

    constant<T>(value: T): () => T

    flow: Types.Flow;
    flowRight: Types.Flow;

    identity<T>(value: T): T

    iteratee: Types.IterateeMethod;

    matches<T, O>(obj: T): (obj: O) => boolean
    matchesProperty<O>(path: Types.PathLocation, value: any): (obj: O) => boolean

    method: Types.Method;

    methodOf: Types.MethodOf;

    mixin<TObject, TSource>(obj: TObject, source: TSource, options?: { chain?: boolean }): TObject & TSource
    mixin<TSource>(source: TSource, options?: { chain?: boolean }): IStatic & TSource

    noConflict(): IStatic

    noop(...args: any[]): void

    nthArg<TResult>(num?: number): TResult

    over: Types.Over;

    overEvery: Types.OverEveryORSome;
    overSome: Types.OverEveryORSome;

    property<TResult>(path: Types.PathLocation): (object: any) => TResult
    propertyOf<TResult>(object: any): (path: Types.PathLocation) => TResult

    range: Types.Range;
    rangeRight: Types.Range;

    runInContext(context?: any): IStatic

    times<TResult>(n: number, iteratee: (num: number) => TResult): TResult[]
    times(n: number): number[]

    toPath(value: string): string[]

    uniqueId(prefix?: string): string

    now(): number
}
namespace Types {
    interface Tap {
        <T>(array: ArrayLike<T>, interceptor: (value: T) => void): ArrayLike<T>;
    }

    interface Thru {
        <T, TResult>(array: ArrayLike<T>, interceptor: (value: T) => TResult): TResult;
    }

    namespace Wrap {
        interface Value<T> {
            (): T;
        }

        interface BaseWrapper<T, TWrapper> { }
        interface ImplicitWrapper<T, TWrapper> extends BaseWrapper<T, TWrapper> { }
        interface ExplicitWrapper<T, TWrapper> extends BaseWrapper<T, TWrapper> { }

        interface ArrayWrapper<T, TWrapper> extends BaseWrapper<T, TWrapper> {
            [Symbol.iterator](): IterableIterator<T>;
            next(): IteratorResult<T>;
            plant(array: T[]): TWrapper;
            tap(interceptor: (value: T) => void): TWrapper;
            toJSON: Value<T[]>;
            valueOf: Value<T[]>;
            value: Value<T[]>;
        }

        interface ImplicitArray<T, TWrapper extends ImplicitArray<T, TWrapper>> extends ArrayWrapper<T, TWrapper>, ImplicitWrapper<T, TWrapper> {
            commit(): TWrapper;
            chain(): ExplicitArray1<T>;
            thru<TResult>(interceptor: (value: T) => TResult): ImplicitArray1<TResult>;
        }

        interface ImplicitArray1<T> extends ImplicitArray<T, ImplicitArray1<T>> { }

        interface ExplicitArray<T, TWrapper extends ExplicitArray<T, TWrapper>> extends ArrayWrapper<T, TWrapper>, ExplicitWrapper<T, TWrapper> {
            commit(): TWrapper;
            thru<TResult>(interceptor: (value: T) => TResult): ExplicitArray1<TResult>;
        }

        interface ExplicitArray1<T> extends ExplicitArray<T, ExplicitArray1<T>> { }

        interface ObjectWrapper<T, TObj extends { [index: string]: T }, TWrapper> extends BaseWrapper<TObj, TWrapper> {
            [Symbol.iterator](): IterableIterator<T>;
            next(): IteratorResult<T>;
            tap(interceptor: (value: T) => void): TWrapper;
            toJSON: Value<TObj>;
            valueOf: Value<TObj>;
            value: Value<TObj>;
        }

        interface ImplicitObject<T, TObj extends { [index: string]: T }, TWrapper extends ImplicitObject<T, TObj, TWrapper>> extends ObjectWrapper<T, TObj, TWrapper>, ImplicitWrapper<T, TWrapper> {
            commit(): TWrapper;
            chain(): ExplicitObject1<T, TObj>;
            thru<TResult>(interceptor: (value: T) => TResult): ImplicitArray1<TResult>;
        }

        interface ImplicitObject1<T, TObj extends { [index: string]: T }> extends ImplicitObject<T, TObj, ImplicitObject1<T, TObj>> { }

        interface ExplicitObject<T, TObj extends { [index: string]: T }, TWrapper extends ExplicitObject<T, TObj, TWrapper>> extends ObjectWrapper<T, TObj, TWrapper>, ExplicitWrapper<T, TWrapper> {
            commit(): TWrapper;
            thru<TResult>(interceptor: (value: T) => TResult): ExplicitArray1<TResult>;
        }

        interface ExplicitObject1<T, TObj extends { [index: string]: T }> extends ExplicitObject<T, TObj, ExplicitObject1<T, TObj>> { }

        interface ValueWrapper<T, TWrapper> {
            tap(interceptor: (value: T) => void): TWrapper;
            toJSON: Value<T>;
            valueOf: Value<T>;
            value: Value<T>;
        }

        interface ImplicitValue<T, TWrapper extends ImplicitValue<T, TWrapper>> extends ValueWrapper<T, TWrapper> {
            commit(): TWrapper;
            thru<TResult>(interceptor: (value: T) => TResult): ImplicitValue1<TResult>;
        }

        interface ImplicitValue1<T> extends ExplicitArray<T, ImplicitValue1<T>> { }

        interface ExplicitValue<T, TWrapper extends ExplicitValue<T, TWrapper>> extends ValueWrapper<T, TWrapper> {
            commit(): TWrapper;
            thru<TResult>(interceptor: (value: T) => TResult): ExplicitValue1<TResult>;
        }

        interface ExplicitValue1<T> extends ExplicitArray<T, ExplicitValue1<T>> { }

        interface StringWrapper extends ValueWrapper<string, StringWrapper> {
            tap(interceptor: (value: string) => void): StringWrapper;
            toJSON: Value<string>;
            valueOf: Value<string>;
            value: Value<string>;
        }

        interface ExplicitString extends ExplicitValue<string, ExplicitString> { }
    }
}

interface IStatic extends Types.PH {
    <T>(array: ArrayLike<T>): Types.Wrap.ImplicitArray1<T>;
    <T, TObj extends { [index: string]: T }>(obj: T): Types.Wrap.ImplicitObject1<T, TObj>;
}

var Static: IStatic;
interface IStatic {
    chain<T>(array: ArrayLike<T>): Types.Wrap.ExplicitArray1<T>;
    chain<T, TObj extends { [index: string]: T }>(obj: T): Types.Wrap.ExplicitObject1<T, TObj>;
}

export = Static;
}
declare module 'lodash' {
import main = require('lodash/out/lodash');
export = main;
}