export interface TagCloudOptions {
    randomize: boolean;
    classPrefix: string;
    additionalAttributes: Record<string, AttributeVal>;
    replacements: TagCloudReplacement[];
    numBuckets: number;
    htmlTag: string;
}

export type AttributeVal = string | { encode: boolean, value: string };

export interface TagCloudMetadata {
    tagName: string;
    count: number;
}

export interface TagCloudReplacement {
    find: string;
    replace: string;
}