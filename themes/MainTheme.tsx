import { createContext, useContext } from "react";

const theme = {
    colors: {
    },
    fonts: {
    },
    fontSizes: {
    },
    sizes: {
    }
};
export const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }: any) => {
    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const ThemeUse = () => useContext(ThemeContext);
