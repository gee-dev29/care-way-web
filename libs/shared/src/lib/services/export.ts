import { ElementRef, Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
@Injectable({
  providedIn: 'root',
})
export class Export {
  exportExcel(data: any, excelFileName: string) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    });
  }

  saveAsExcelFile(buffer: string, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  downloadAsPDF(file: ElementRef, fileName: string) {
    const DATA = file.nativeElement;
    html2canvas(DATA, { scale: 2, useCORS: true }).then((canvas) => {
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          canvas,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );
        heightLeft -= pageHeight;
      }
      const totalPages = (doc as any).internal.pages.length - 1;
      if (totalPages > 1) {
        const lastPage = totalPages;
        const finalContentHeight = imgHeight % pageHeight;
        if (finalContentHeight < 20) {
          doc.deletePage(lastPage);
        }
      }
      doc.save(`${fileName}.pdf`);
    });
  }

  exportFile(data: any, fileType: any, fileName: string) {
    const blob = new Blob([data], { type: fileType });
    FileSaver.saveAs(blob, fileName);
  }

  exportToCSV(headers: any, data: any, fileName: string) {
    const seperator = ',';
    const csvContent =
      headers.join(seperator) +
      '\n' +
      data
        .map((rowData: any) => {
          return headers
            .map((headKey: any) => {
              return rowData[headKey.toLowerCase()] === null ||
                rowData[headKey] === undefined
                ? ''
                : rowData[headKey];
            })
            .join(seperator);
        })
        .join('\n');
    this.exportFile(csvContent, 'text/csv', fileName);
  }
}
