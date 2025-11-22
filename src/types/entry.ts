import { Doc } from "@convex/_generated/dataModel";

export interface DecryptedEntry extends Doc<"entries"> {
    decryptedNotes?: string;
    decryptedTags?: string[];
}
