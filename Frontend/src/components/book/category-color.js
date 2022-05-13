const array = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime'
];
export const getRandomColor = () => {
    return array[Math.floor(Math.random() * array.length)];
};