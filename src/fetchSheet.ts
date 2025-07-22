import {
  GoogleSpreadsheet,
  GoorgleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { ColumnTypes } from './columnTypes.d';
import { cleanRows } from './fetchSheet/cleanRows';
import { getSpreadsheet } from './fetchSheet/get';
import { hash } from './fetchSheet/hash';

export default async (
  spreadsheetId: string,
  credentials?: object,
  apiKey?: string,
) => {
  const spreadsheet = await getSpreadsheet(spreadsheetId, credentials, apiKey);
  const worksheets = [spreadsheet._rawSheets[`1915137699`]];
  const sheets = await Promise.all(
    worksheets.map(async (worksheet: GoogleSpreadsheetWorksheet) => {
      await worksheet.loadHeaderRow(2);
      const rows = await worksheet.getRows({});
      return {
        [worksheet.title]: cleanRows(rows).map((row, id) =>
          Object.assign(row, {
            id: hash(`${spreadsheetId}-${worksheet.sheetId}-${id}`),
          }),
        ),
      };
    }),
  );
  return Object.assign({}, ...sheets, {
    id: hash(spreadsheetId),
  });
};
