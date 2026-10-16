import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const EXCEL_FILE_PATH = path.join(process.cwd(), 'data', 'appointments.xlsx');

export async function saveToExcel(data: any) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let workbook: XLSX.WorkBook;
  let worksheet: XLSX.WorkSheet;
  let existingData: any[] = [];

  if (fs.existsSync(EXCEL_FILE_PATH)) {
    workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0] || 'Sheet1';
    worksheet = workbook.Sheets[sheetName] || XLSX.utils.json_to_sheet([]);
    existingData = XLSX.utils.sheet_to_json(worksheet);
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Add timestamp
  const newData = {
    ...data,
    'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  existingData.push(newData);

  worksheet = XLSX.utils.json_to_sheet(existingData);
  
  // Column widths
  const wscols = [
    { wch: 20 }, // Name
    { wch: 15 }, // Phone
    { wch: 25 }, // Email
    { wch: 20 }, // Service
    { wch: 20 }, // Doctor
    { wch: 15 }, // Date
    { wch: 30 }, // Message
    { wch: 25 }, // Submitted At
  ];
  worksheet['!cols'] = wscols;

  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) {
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
  } else {
    workbook.Sheets[firstSheet] = worksheet;
  }

  XLSX.writeFile(workbook, EXCEL_FILE_PATH);
}

export function getExcelFilePath() {
  return EXCEL_FILE_PATH;
}
