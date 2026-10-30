export interface UserItem {
    HoyoLabAuthToken?: string,
    HoyoLabAccountId?: string,
    VGGWins?: number
}

export interface UserData {
    [userId: string]: UserItem
}