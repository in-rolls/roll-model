import test from 'node:test';
import assert from 'node:assert/strict';
import { ROWS, distinct_values, filter_rows, sort_rows, page_rows, to_csv } from '../site/js/data.js';

test('all demo records are visibly synthetic and unique', () => {
  assert.equal(ROWS.length, 144);
  assert.equal(new Set(ROWS.map(row => row.elector_id)).size, ROWS.length);
  assert.ok(ROWS.every(row => row.elector_id.startsWith('DEMO-')));
  assert.ok(ROWS.every(row => row.elector_name.startsWith('Example Elector ')));
  assert.ok(ROWS.every(row => row.state.startsWith('Demo State ')));
});

test('dependent filters only expose values within the selected state and year', () => {
  const state_rows = filter_rows(ROWS, { state: 'Demo State B' });
  assert.deepEqual(distinct_values(state_rows, 'year'), [2022, 2024]);
  const year_rows = filter_rows(state_rows, { year: 2024 });
  assert.deepEqual(distinct_values(year_rows, 'parliamentary_constituency'),
    ['Example Coast', 'Example Valley']);
  assert.equal(filter_rows(year_rows, { constituency: 'Example Coast' }).length, 12);
});

test('search, sort, and pagination compose without changing source rows', () => {
  const rows = filter_rows(ROWS, { state: 'Demo State A', search: 'example ward 2' });
  assert.equal(rows.length, 16);
  const sorted = sort_rows(rows, 'age', 'desc');
  assert.equal(page_rows(sorted, 1, 5).length, 5);
  assert.equal(page_rows(sorted, 4, 5).length, 1);
  assert.equal(ROWS[0].elector_id, 'DEMO-0001');
  assert.throws(() => sort_rows(rows, 'missing'), RangeError);
});

test('CSV exports all filtered rows with headers and quoted cells', () => {
  const rows = filter_rows(ROWS, { state: 'Demo State C', year: 2022,
    constituency: 'Example Hills' });
  const csv = to_csv(rows);
  assert.equal(csv.split('\r\n').length, 14);
  assert.ok(csv.startsWith('"state","year","parliamentary_constituency"'));
  assert.ok(csv.includes('"DEMO-0097"'));
  assert.ok(!csv.includes('DEMO-0001'));
});
