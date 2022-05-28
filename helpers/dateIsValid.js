export default function dateIsValid(input) {
    if (!input) {
        return true; // if input is empty, it's ok (no filter);
    }

    const date = new Date(input);
    if (typeof date === 'object' && date !== null && typeof date.getTime === 'function' &&
        !isNaN(date) && date.getTime() > 0 && !(date.getTime() > new Date().getTime())
    ) {
        return true;
    }
}