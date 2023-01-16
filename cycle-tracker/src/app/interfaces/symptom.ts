
export interface Symptom{
    id: string,
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