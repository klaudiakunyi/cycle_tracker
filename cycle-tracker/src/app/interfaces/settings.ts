export interface Settings{
    userId: string,
    mode: string,
    notifications: {
        menstruationPrediction: boolean,
        ovulationPrediction: boolean
    }
    dailySymptoms:{
        temperature: boolean,
        mood: boolean,
        blood: boolean,
        pain: boolean,
        cervicalMucus: boolean,
        contraceptionUsage: boolean,
        sexualActivity: boolean
    },
    color: string
}