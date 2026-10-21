import { ROWS, COLUMNS, distinct_values, filter_rows, sort_rows, page_rows, to_csv } from './data.js';

const PAGE_SIZE = 12;
const state_filter = document.querySelector('#state-filter');
const year_filter = document.querySelector('#year-filter');
const constituency_filter = document.querySelector('#constituency-filter');
const search_filter = document.querySelector('#search-filter');
const results_body = document.querySelector('#results-body');
const result_count = document.querySelector('#result-count');
const page_count = document.querySelector('#page-count');
const previous_button = document.querySelector('#previous-button');
const next_button = document.querySelector('#next-button');
const download_button = document.querySelector('#download-button');

let page = 1;
let sort_key = 'elector_id';
let sort_direction = 'asc';
let filtered_rows = ROWS;

function set_options(select, values, placeholder) {
  select.replaceChildren(new Option(placeholder, ''), ...values.map(value => new Option(value, value)));
}

function update_options() {
  const state_rows = filter_rows(ROWS, { state: state_filter.value });
  set_options(year_filter, distinct_values(state_rows, 'year'), 'All years');
  const year_rows = filter_rows(state_rows, { year: year_filter.value });
  set_options(constituency_filter, distinct_values(year_rows, 'parliamentary_constituency'),
    'All constituencies');
}

function current_filters() {
  return {
    state: state_filter.value,
    year: year_filter.value,
    constituency: constituency_filter.value,
    search: search_filter.value,
  };
}

function render_rows(rows) {
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const { key } of COLUMNS) {
      const td = document.createElement('td');
      td.textContent = row[key];
      if (key === 'elector_id') td.className = 'record-id';
      tr.append(td);
    }
    fragment.append(tr);
  }
  if (rows.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = COLUMNS.length;
    td.className = 'empty-state';
    td.textContent = 'No examples match these filters. Try a broader search.';
    tr.append(td);
    fragment.append(tr);
  }
  results_body.replaceChildren(fragment);
}

function render() {
  filtered_rows = sort_rows(filter_rows(ROWS, current_filters()), sort_key, sort_direction);
  const total_pages = Math.max(1, Math.ceil(filtered_rows.length / PAGE_SIZE));
  page = Math.min(page, total_pages);
  render_rows(page_rows(filtered_rows, page, PAGE_SIZE));

  result_count.textContent = `${filtered_rows.length} example ${filtered_rows.length === 1 ? 'record' : 'records'} found`;
  page_count.textContent = `Page ${page} of ${total_pages}`;
  previous_button.disabled = page === 1;
  next_button.disabled = page === total_pages;
  download_button.disabled = filtered_rows.length === 0;
  for (const th of document.querySelectorAll('th[data-key]')) {
    th.setAttribute('aria-sort', th.dataset.key === sort_key
      ? (sort_direction === 'asc' ? 'ascending' : 'descending') : 'none');
    th.querySelector('span').textContent = th.dataset.key === sort_key
      ? (sort_direction === 'asc' ? '↑' : '↓') : '↕';
  }
}

state_filter.addEventListener('change', () => {
  update_options();
  page = 1;
  render();
});

year_filter.addEventListener('change', () => {
  const year = year_filter.value;
  update_options();
  year_filter.value = year;
  const year_rows = filter_rows(ROWS, { state: state_filter.value, year });
  set_options(constituency_filter, distinct_values(year_rows, 'parliamentary_constituency'),
    'All constituencies');
  page = 1;
  render();
});

constituency_filter.addEventListener('change', () => { page = 1; render(); });
search_filter.addEventListener('input', () => { page = 1; render(); });

document.querySelector('#reset-button').addEventListener('click', () => {
  state_filter.value = '';
  search_filter.value = '';
  update_options();
  sort_key = 'elector_id';
  sort_direction = 'asc';
  page = 1;
  render();
});

document.querySelector('thead').addEventListener('click', event => {
  const button = event.target.closest('button[data-sort]');
  if (!button) return;
  const key = button.dataset.sort;
  sort_direction = sort_key === key && sort_direction === 'asc' ? 'desc' : 'asc';
  sort_key = key;
  page = 1;
  render();
});

previous_button.addEventListener('click', () => { page -= 1; render(); });
next_button.addEventListener('click', () => { page += 1; render(); });

download_button.addEventListener('click', () => {
  const blob = new Blob([to_csv(filtered_rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roll-model-synthetic-demo.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});

set_options(state_filter, distinct_values(ROWS, 'state'), 'All demo states');
update_options();
render();
