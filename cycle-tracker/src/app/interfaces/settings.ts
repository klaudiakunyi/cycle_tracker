export interface Settings{
    userId: string,
    symptoms:{
        temperature: boolean,
        mood: boolean,
        blood: boolean,
        pain: boolean,
        cervicalMucus: boolean,
        contraceptionUsage: boolean,
        sexualActivity: boolean
    }
}