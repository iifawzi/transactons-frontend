export default function dateIsValid(input) {
    if (input) {
        const date = new Date(input);
        if (typeof date === 'object' && date !== null && typeof date.getTime === 'function' &&
            !isNaN(date) && date.getTime() > 0 && !(date.getTime() > new Date().getTime())
        ) {
            return true;
        }
        return false;
    } else {
        return true // if date is not empty, it's ok
    }

}