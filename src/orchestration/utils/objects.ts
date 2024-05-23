// Perform a deep merge from one object to another, the target object is modified
export function deepMergeOnto(target: any, source: any) {
    const isTargetObject = typeof target === 'object';
    const isSourceObject = typeof source === 'object';
    const isTargetArray = Array.isArray(target);
    const isSourceArray = Array.isArray(source);

    // This is not a deep merge, return the source object
    if (!isTargetObject && !isSourceObject && !isTargetArray && !isSourceArray) {
        return source;
    }
    if (target === undefined && source !== undefined) {
        return JSON.parse(JSON.stringify(source))
    }
    if (source === undefined) {
        return target
    }

    // We are merging two arrays, just return a deep copy of the source array
    if (!isTargetObject && !isSourceObject) {
        return JSON.parse(JSON.stringify(source));
    }

    // We are merging two objects
    for (const key in source) {
        target[key] = deepMergeOnto(target[key], source[key]);
    }
    return target;
}

// Perform a deep merge with two objects and return the result, neither object is modified
export function deepMergeTogether(a: any, b: any) {
    return deepMergeOnto(JSON.parse(JSON.stringify(a)), b);
}

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}