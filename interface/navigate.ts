export type StackParamList = {
    tab: undefined
    invitation: { tripId?: string; inviteLink?: string }
    signIn: { setIsSignedIn: React.Dispatch<React.SetStateAction<Boolean>> }
    signUp: undefined
    achievement: undefined
    blog: undefined
    discovery: undefined
    profile: undefined
    tripPlanner: undefined
    placeInformation: {
        placeId: string
        type: string
        forecastDate?: string
        forecastDuration?: string
    }
}
