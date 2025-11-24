// PowerApps SAVe Color Theme
export const theme = {
    colors: {
        // Primary colors from PowerApps
        primary: {
            main: '#6264A7',      // Purple
            light: '#7B7DC0',
            dark: '#4A4C8A',
            contrast: '#FFFFFF',
        },
        secondary: {
            main: '#0078D4',      // Blue
            light: '#33A3E0',
            dark: '#005A9E',
            contrast: '#FFFFFF',
        },
        background: {
            default: '#F3F2F1',   // Light gray
            paper: '#FFFFFF',
            dark: '#464775',      // Dark purple for sidebar
        },
        text: {
            primary: '#323130',
            secondary: '#605E5C',
            disabled: '#A19F9D',
            white: '#FFFFFF',
        },
        border: {
            light: '#EDEBE9',
            main: '#D2D0CE',
            dark: '#8A8886',
        },
        success: '#107C10',
        warning: '#FFB900',
        error: '#D13438',
        info: '#0078D4',
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },
    borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
    },
    shadows: {
        sm: '0 1px 2px rgba(0,0,0,0.1)',
        md: '0 2px 4px rgba(0,0,0,0.12)',
        lg: '0 4px 8px rgba(0,0,0,0.15)',
    },
};

export default theme;
