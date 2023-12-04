import { CircleNoteParams } from "./model/params/circle-notes-params";

export const desktopParams: CircleNoteParams = {
    radius : 20,
    titleFontSize : (window.innerWidth/100).toString(),
    subtitleFontSize : (window.innerWidth/150).toString(),  
    strokeWidth : 0.5
}

export const mobileParams: CircleNoteParams = {
    radius : 15,
    titleFontSize : (window.innerWidth/35).toString(),
    subtitleFontSize : (window.innerWidth/45).toString(),  
    strokeWidth : 0.5
}