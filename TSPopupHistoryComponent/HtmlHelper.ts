export class HtmlHelper {
    public CreateTable(rowCount:number,columnCount:number,headerNames:string[]):string {
        let tableHtml = '<table class="table-temp" style="width: 100%;">';
        if(headerNames.length != 0) {
            let tableHeader = '<theader>';
            tableHeader += '<tr class="table-tr" style="background-color: navajowhite;">';
            headerNames.forEach(element => {
                tableHeader += '<td class="table-th">'+element+'</td>';
            });
            tableHeader += '</tr>';
            tableHeader += '</theader>';

            tableHtml += tableHeader;
        }

        tableHtml +='<tbody>';
        tableHtml +='{0}';
        tableHtml +='</tbody>';        

        tableHtml += '</table>';

        return tableHtml;
    }

    public CreateDialogElement():string {
        let divElement = '<dialog id="default-window"></dialog>';

        return divElement;
    }
}