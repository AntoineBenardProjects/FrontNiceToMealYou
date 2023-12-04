export interface ColorPalette{
    name?: string,
    white?: string,
    black?: string,
    grey?: string,
    mainColor?: string,
    secondColor?: string,
    thirdColor?: string
}

export const Palettes: ColorPalette[] = [
    {name: "Payne",white: "#FEFFFE", black: "#090A0D", mainColor: "#5C6784"},
    {name: "Tkhelet",white:"#F7F7FF",black:"#080510",mainColor:"#4F359B"},
    {name: "Default",secondColor: "#6C0E23",white:"#f0e7e9",black:"#120206",mainColor:"#dac3c8",thirdColor:"#5DA271"}
]