export function hashString (str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

export function hashObject (obj: any): string {
    return hashString(JSON.stringify(obj));
}

export function fixFormatting (str: string): string {

    const spacesOnLine = (line: string) => {
        let count = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') count++;
            else break;
        }
        return count;
    }

    const spacesPerLine = str.split('\n').filter(line => line.trim() !== '').map(spacesOnLine)
    const smallestSpaces = spacesPerLine.toSorted()[0]
    
    const fixLine = (line: string) => {
        if (line.trim() === '') return ''
        return line.substring(smallestSpaces)
    }

    return str.split('\n').map(fixLine).join('\n')
}

export function extractObject (str: string) {
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    return JSON.parse(str.substring(start, end + 1));
}