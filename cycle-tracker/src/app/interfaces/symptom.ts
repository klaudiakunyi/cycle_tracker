import { DateTime } from "luxon";

export interface Symptom{
    userId: string,
    date: string,
    temperature?: number,
    mood?: string[],
    blood?: string,
    pain?: string,
    cervicalMucus?: string,
    contraceptionUsage?: string,
    sexualActivity?: string
}