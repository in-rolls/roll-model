const STATES = [
  { name: 'Demo State A', constituencies: ['Example North', 'Example Central'] },
  { name: 'Demo State B', constituencies: ['Example Coast', 'Example Valley'] },
  { name: 'Demo State C', constituencies: ['Example Hills', 'Example South'] },
];

const YEARS = [2022, 2024];
const SEXES = ['Female', 'Male', 'Other'];

export const COLUMNS = [
  { key: 'elector_id', label: 'Demo ID' },
  { key: 'elector_name', label: 'Elector' },
  { key: 'age', label: 'Age' },
  { key: 'sex', label: 'Sex' },
  { key: 'assembly_constituency', label: 'Assembly area' },
  { key: 'part_number', label: 'Part' },
  { key: 'polling_station', label: 'Polling station' },
];

export const ROWS = Object.freeze(STATES.flatMap((state, state_index) =>
  YEARS.flatMap((year, year_index) =>
    state.constituencies.flatMap((parliamentary_constituency, constituency_index) =>
      Array.from({ length: 12 }, (_, row_index) => {
        const number = state_index * 48 + year_index * 24 + constituency_index * 12 + row_index + 1;
        return Object.freeze({
          state: state.name,
          year,
          parliamentary_constituency,
          elector_id: `DEMO-${String(number).padStart(4, '0')}`,
          elector_name: `Example Elector ${String(number).padStart(3, '0')}`,
          age: 18 + (number * 7) % 63,
          sex: SEXES[number % SEXES.length],
          assembly_constituency: `Example Ward ${1 + row_index % 3}`,
          part_number: 1 + Math.floor(row_index / 4),
          polling_station: `Demo Station ${1 + row_index % 4}`,
        });
      }),
    ),
  ),
));

export function distinct_values(rows, key) {
  return [...new Set(rows.map(row => row[key]))].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true }),
  );
}

export function filter_rows(rows, { state = '', year = '', constituency = '', search = '' } = {}) {
  const query = search.trim().toLocaleLowerCase();
  return rows.filter(row => {
    if (state && row.state !== state) return false;
    if (year && String(row.year) !== String(year)) return false;
    if (constituency && row.parliamentary_constituency !== constituency) return false;
    if (!query) return true;
    return COLUMNS.some(({ key }) => String(row[key]).toLocaleLowerCase().includes(query));
  });
}

export function sort_rows(rows, key = 'elector_id', direction = 'asc') {
  if (!COLUMNS.some(column => column.key === key)) throw new RangeError('Unknown sort column');
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => multiplier * String(a[key]).localeCompare(
    String(b[key]), undefined, { numeric: true, sensitivity: 'base' },
  ));
}

export function page_rows(rows, page, page_size = 12) {
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(page_size) || page_size < 1) {
    throw new RangeError('Invalid page');
  }
  return rows.slice((page - 1) * page_size, page * page_size);
}

function csv_cell(value) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function to_csv(rows) {
  const keys = ['state', 'year', 'parliamentary_constituency', ...COLUMNS.map(column => column.key)];
  const lines = [keys.map(csv_cell).join(',')];
  for (const row of rows) lines.push(keys.map(key => csv_cell(row[key])).join(','));
  return `${lines.join('\r\n')}\r\n`;
}
