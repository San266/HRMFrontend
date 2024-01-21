import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import LoadingScreen from './Loading';

export default function ExcelFile(props) {

  const [loading, setloading] = React.useState(false);

  const handleExcelData = async () => {
    let getData = await props.data();
    if (getData) {
      await exportToCSV(getData);
    } else {
      alert("No Data Found");
    }
  }

  const exportToCSV = async (excelData) => {
    if (excelData.length > 0) {
      setloading(true);
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "Data" + fileExtension);
      setloading(false);
    } else {
      setloading(true);
      alert("NO DATA FOUND");
      setloading(false);
    }
  }

  return (

    <div >
      {
        loading == false &&
        <button className="btn btn-primary" onClick={handleExcelData}>Export to Excel</button>

      }
      {
        loading &&
        <LoadingScreen></LoadingScreen>
      }
    </div>
  )
}
