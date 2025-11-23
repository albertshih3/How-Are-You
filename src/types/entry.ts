import { Doc } from "@convex/_generated/dataModel";
import type { LocationData } from "@/lib/types/location";

export interface DecryptedEntry extends Doc<"entries"> {
    decryptedNotes?: string;
    decryptedTags?: string[];
    decryptedLocation?: LocationData | null;
}
