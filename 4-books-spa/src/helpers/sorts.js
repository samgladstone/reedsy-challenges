export function sortByTextProperty(textFieldToCompare, descending) {
    const directionModifier = descending ? -1 : 1;
    return (a, b) => {
        let av = a[textFieldToCompare];
        let bv = b[textFieldToCompare];

        const noAv = !av && av !== '';
        const noBv = !bv && bv !== '';

        return noAv || noBv
            ? noAv && noBv
                ? 0
                : noAv
                    ? 1
                    : -1
            : sortText(av, bv, directionModifier);
    };
}

export function sortByTextYearProperty(textFieldToCompare, descending) {
    const directionModifier = descending ? -1 : 1;
    return (a, b) => {
        let av = a[textFieldToCompare];
        let bv = b[textFieldToCompare];

        const yearRegex = /^(\d+)\s?(?:(?:B\.?)?C\.?E?\.?|A\.?D\.?|B\.?C\.?)?$/;
        const noAv = !av || !yearRegex.test(av);
        const noBv = !bv || !yearRegex.test(bv);

        if (noAv || noBv)
            return noAv && noBv ? 0 : noAv ? 1 : -1

        // TODO: This could be extended to parse dates

        const bcRegex = /^\d+\s?B\.?C\.?E?\.?$/;
        const aIsBc = bcRegex.test(av);
        const bIsBc = bcRegex.test(bv);

        return directionModifier * (aIsBc && bIsBc ? -1 : 1) * (
            // If only one is BC then it comes first
            (aIsBc || bIsBc) && !(aIsBc && bIsBc)
                ? aIsBc ? -1 : 1
                // Otherwise compare by year
                : Number(yearRegex.exec(av)[1]) - Number(yearRegex.exec(bv)[1])
        );
    };
}


const sortText = (a, b, directionModifier) => (
    (a, b, directionModifier) => directionModifier * (a < b ? -1 : a > b ? 1 : 0)
)((a + '').toLowerCase(), (b + '').toLowerCase(), directionModifier);
