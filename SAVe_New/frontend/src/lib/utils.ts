export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "-";

    // Handle ISO strings with time component (e.g. 2023-01-01T00:00:00Z) or yyyy-mm-dd
    // by taking the first part if it contains T.
    // This treats the date part as absolute, avoiding timezone shifts.
    let cleanDateStr = dateString;
    if (typeof dateString === 'string' && dateString.includes('T')) {
        cleanDateStr = dateString.split('T')[0];
    }

    // Check if it's already in dd/mm/yyyy format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDateStr)) {
        return cleanDateStr;
    }

    // Handle yyyy-mm-dd (now including stripped ISO strings)
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDateStr)) {
        const parts = cleanDateStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid

        // Final fallback for other formats
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    } catch (e) {
        return dateString;
    }
}
