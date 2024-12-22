export interface InputInfos{
    color: string,
    placeholderColor: string,
    placeholderColorActive: string,
    backgroundColor: string,
    borderColor?: string,
    borderColorActive?: string,
    backgroundSearchColor?: string,
    backgroundSearchColorHover?: string,
    colorSearch?: string,
    colorSearchHover?: string,
    fontSize?: string,
    type?: string,
    hoverTextColor?: string,
    hoverBackgroundColor?: string,
    hoverTransition?: string,
    hoverBorderColor?: string,
    bottomOnly?: boolean,
    noPadding?:boolean,
    animationWidth?: boolean
}
export interface CheckboxInfos{
    color: string,
    colorActive: string,
    backgroundColorActive: string,
    backgroundColor: string,
    borderColorActive: string,
    borderColor: string,
    hoverTextColor?: string,
    hoverBackgroundColor?: string,
    hoverBorderColor?: string,
    hoverTextColorValid?: string,
    hoverBackgroundColorValid?: string,
    hoverBorderColorValid?: string
}
export interface ButtonInfos{
    color: string,
    colorActive?: string,
    backgroundColor?: string,
    backgroundColorActive?: string,
    fontSize?: string,
    fontWeight?: number,
    borderColor?: string,
    borderWidth?: string,
    borderColorActive?: string,
    radius?: string,
    cursor?: string,
    heightIcon?: string,
    animationWidth?: boolean,
}
export interface LinkCardInfos{
    color: string;
    borderColor: string;
    colorActive: string;
    textColorActive: string;
    selectedBorderColor: string;
}
export interface SelectInfos{
    textColor?: string,
    backgroundColor?: string,
    borderColor?: string,
    borderColorActive?: string,
    optionBackgroundColor?: string,
    optionTextColor?: string,
    hoverBackgroundColor?: string,
    hoverTextColor?: string,
    width?: number,
    fontSize?: number,
    height?: number,
    topHoverBackgroundColor?: string,
    topHoverColor?: string,
    topHoverBorderColor?: string,
    animationWidth?: boolean
}
export interface AutocompleteInfos{
    textColor?: string,
    backgroundColorActive?: string,
    backgroundColor?: string,
    textColorActive?: string,
}
export interface SelectData{
    id: string,
    name: string,
    selected?: boolean,
    subtitle?: string,
    originalData?: any,
}
export interface RoundProgressBarInfos{
    color: string,
    textColor: string,
    title?: string,
    subtitle?: string,
    width: number,
    fontWeight?: number,
    editable?: boolean,
    note: number
}
export interface RangeSliderInfos{
    activeColor: string,
    unactiveColor: string,
    pointSize: number,
    width: number,
    length: number,
    maxValue: number,
    minValue: number,
    legendText: string,
    maxValueText: string,
    borderColor: string,
    borderWidth: number,
    borderWidthDialog: number,
    unit: string,
    initValue?: number,
    plus: boolean
}