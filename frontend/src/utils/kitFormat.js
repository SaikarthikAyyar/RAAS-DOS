// A fleet unit's kit (pumps + accessories) is always shown with ids:
//   pump       "PMP-004 (#4) External Trash Pump"
//   accessory  "Hydraulic powerpack (#12)"

export function formatPump(pump){
    return `${pump.code} (#${pump.id}) ${pump.name}`;
}

export function formatAccessory(accessory){
    return `${accessory.name} (#${accessory.id})`;
}

export function formatPumpList(pumps, empty = "-"){
    return pumps?.length ? pumps.map(formatPump).join(", ") : empty;
}

export function formatAccessoryList(accessories, empty = "-"){
    return accessories?.length ? accessories.map(formatAccessory).join(", ") : empty;
}
