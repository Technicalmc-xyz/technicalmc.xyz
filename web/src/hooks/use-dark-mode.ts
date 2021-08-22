import { createContext, useContext } from "react";

export const DarkModeCtx = createContext<{
	dark: boolean,
	setDark(dark: boolean): void
}>(null as any);

export const useDarkMode = () => useContext(DarkModeCtx);
