// ====================================
// EXPORT FILENAME DATE STAMP
// Every export/report file in the app gets today's date appended to
// its name, so a re-downloaded copy never silently overwrites (or gets
// confused with) an earlier one. One shared helper rather than
// re-implementing date formatting at each of the ~8 export call sites.
// ====================================

export function dateStamp(){

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// Inserts the date stamp before a filename's extension -
// "Report.xlsx" -> "Report_2026-08-26.xlsx". Works for any extension.
export function withDateStamp(filename){

    const dotIndex = filename.lastIndexOf(".");

    if(dotIndex === -1){
        return `${filename}_${dateStamp()}`;
    }

    return `${filename.slice(0, dotIndex)}_${dateStamp()}${filename.slice(dotIndex)}`;

}
