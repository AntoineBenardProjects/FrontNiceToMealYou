import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonInfos } from "../designs";

export class TopHeight{
    top: number = 0;
    height: number = 0;
}

export class StyleLineFirstPage{
    textColor: string = "";
    backgroundColor: string = "";
    titleColor: string = "";
    shadowGradient: string = "";
}
export class PositionIconFirstPage{
    paddingIcon: number = 0;
    scaleShadow: number = 1;
    textOpacity: boolean = true;
    titleOpacity: boolean = true;
}

export class IdValue{
    id: string;
    value: any;
}

export class ColorsAndText{
    color: string;
    backgroundColor: string;
    texts: string[];
    iconInfos?: ButtonInfos;
    icon?: IconDefinition;
}
export interface ChangeBackgroundColorInfos{
    color: string;
    logoToShow: string;
}
export class ChangeBackgroundColorComponentInfos{
    background: ChangeBackgroundColorInfos;
    textColor: string;
    complementaryColor: string;
    secondComplementaryColor: string;

    constructor(
        backgroundValue: ChangeBackgroundColorInfos,
        textColorValue: string,
        complementaryColorValue: string,
        secondComplementaryColorValue: string
    ){
        this.background = backgroundValue;
        this.textColor = textColorValue;
        this.complementaryColor = complementaryColorValue;
        this.secondComplementaryColor = secondComplementaryColorValue;
    }
}
export class MovingRectangleBackground{
    top: number;
    originalTop: number;
    originalLeft: number;
    width: number;
    height: number;
    left: number;
    color: string;
    movingSpeed?: number;
    movingSide?: boolean;
    constructor(
        topValue: number, 
        widthValue: number, 
        heightValue: number, 
        leftValue: number, 
        colorValue: string, 
        movingSpeedValue: number, 
        movingSideValue: boolean,
        originalLeftValue: number
    ){
        this.top = topValue;
        this.originalTop = topValue;
        this.width = widthValue;
        this.height = heightValue;
        this.left = leftValue;
        this.color = colorValue;
        this.movingSpeed = movingSpeedValue;
        this.movingSide = movingSideValue;
        this.originalLeft = originalLeftValue;
    }
}