export interface TagCloudOptions {
    randomize: boolean;
    classPrefix: string;
    additionalAttributes: Record<string, AttributeVal>;
    replacements: TagCloudReplacement[];
    numBuckets: number;
    htmlTag: string;
}
export type AttributeVal = string | {
    encode: boolean;
    value: string;
};
export interface TagCloudMetadata {
    tagName: string;
    count: number;
}
export interface TagCloudReplacement {
    find: string;
    replace: string;
}
/**
 * Client Accessible Tag Cloud Function
 * @param array Array of documents of form {tagName: String, count: Number} which will be used to generate the cloud
 * @param callback Function of (err, data) which handles the error (if any) and data returned
 * @param opts Document {optional} which contains any of the options from the API doc
 * @returns {*}
 */
export declare function tagCloud(array: TagCloudMetadata[], options?: TagCloudOptions): Promise<string | string[]>;
