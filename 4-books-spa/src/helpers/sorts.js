export function sortByTextProperty(textFieldToCompare, descending) {
    const directionModifier = descending ? -1 : 1;
    return (a, b) => {
        let av = a[textFieldToCompare];
        let bv = b[textFieldToCompare];

        const noAv = !av && av !== '';
        const noBv = !bv && bv !== '';

        if (noAv || noBv)
            return noAv && noBv ? 0 : noAv ? 1 : -1;

        av = (a[textFieldToCompare] + '').toLowerCase();
        bv = (b[textFieldToCompare] + '').toLowerCase();

        return av < bv ? directionModifier * -1 : av > bv ? directionModifier * 1 : 0;
    };
}