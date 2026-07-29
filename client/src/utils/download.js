/*
  SOAS Feedback Collector - Anonymous course feedback platform for Sapthagiri NPS University
  Copyright (C) 2026 Pawan Simha R

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const escapeCsv = (val) => {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
};

export const downloadCsv = (rows, filename) => {
  const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const downloadDoc = (title, headers, rows, filename) => {
  const trs = rows.map(r =>
    `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; margin: 30px; }
  h1 { color: #1a237e; font-size: 20pt; margin-bottom: 4px; }
  .sub { color: #666; font-size: 11pt; margin-bottom: 20px; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; }
  th { background: #1a237e; color: white; padding: 8px 10px; text-align: left; }
  td { padding: 6px 10px; border: 1px solid #ddd; }
  tr:nth-child(even) td { background: #f8f9fa; }
</style></head>
<body>
  <h1>${title}</h1>
  <p class="sub">Generated on ${new Date().toLocaleString()}</p>
  <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${trs}</tbody></table></body></html>`;

  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};
