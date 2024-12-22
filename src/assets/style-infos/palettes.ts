export interface ColorPalette{
    name?: string,
    white?: string,
    black?: string,
    grey?: string,
    mainColor?: string,
    secondColor?: string,
    errorColor?: string,
    successColor?: string,
    warningColor?: string
}

export const Palettes: ColorPalette[] = [
    {name: "Payne",white: "#FEFFFE", black: "#090A0D", mainColor: "#5C6784"},
    {name: "Tkhelet",white:"#F7F7FF",black:"#080510",mainColor:"#4F359B"},
    // {name: "Default",errorColor: "#6C0E23",white:"#f8f3f4",black:"#110e0f",mainColor:"#dac3c8",thirdColor:"#5DA271"},
    {name: "Default",secondColor:"#C41E3D", warningColor:"#F9A03F", errorColor:"#DE1A1A", successColor: "#23CE6B",white:"#FAF5F9",black:"#151617",mainColor:"#324376"},
    // {name: "Default",errorColor: "#6C0E23",white:"#f8f3f4",black:"#110e0f",mainColor:"#dac3c8",thirdColor:"#5DA271"},
]