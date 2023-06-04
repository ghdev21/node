export const generateId = (length: number = 8): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...new Array(length)].reduce((acc) => {
        const randomIndex = Math.floor(Math.random() * characters.length)
        return acc + characters.charAt(randomIndex)
    }, '');
}
