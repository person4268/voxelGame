function addUDim2(udims: Array<UDim2>, addX = true, addY = true): UDim2 {
    let udimCounter = new UDim2();
    udims.forEach((udim)=>{
        if(addX && addY) udimCounter = udimCounter.add(udim);
        if(addX) udimCounter = new UDim2(udimCounter.X.Scale + udim.X.Scale, udimCounter.X.Offset + udim.X.Offset, udimCounter.Y.Scale, udimCounter.Y.Offset);
        if(addY) udimCounter = new UDim2(udimCounter.X.Scale, udimCounter.X.Offset, udimCounter.Y.Scale + udim.Y.Scale, udimCounter.Y.Offset + udim.Y.Offset);
    })
    return udimCounter;
}

class UITable { 
    constructor(columns: Array<String>, allowSorting = true) {

    }
}

export { addUDim2, UITable }

