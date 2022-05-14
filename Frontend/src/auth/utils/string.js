export const ellipseByLength = (string, length = 50) => {
    if (string.length < length) {
        return string;
    }
    return string.substring(0, length) + '...';
};