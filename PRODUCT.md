# Roll Model product notes

This is a record of the product thinking behind an earlier electoral-roll storefront and a starting point for a future rebuild. It preserves the ideas without publishing the old code, Git history, credentials, or voter data. The current public site is a synthetic interface demo, not the original service.

## The problem and the proposed experience

The original concept was to make Indian electoral-roll records easier to find and work with after choosing a geography and a roll year. A person would create an account, choose one or more parliamentary constituencies, preview a limited sample, and pay per constituency for full table access. The table would support column sorting, filtering, and search.

The intended navigation was **state → year → parliamentary constituency → records**. A customer with more than one purchased constituency would switch between them from a dropdown after login. The initial plan offered 1,000 sample rows for free and then the full constituency after payment. These were product requirements in the original README; they were not all completed in code.

The original plan also treated a customer's own annotations as separate from the underlying roll. Four customer-only fields were proposed for each record: phone, email, address, and comments. Another customer would not see those edits. A later version contemplated customer edits to other fields too, again stored separately. That separation matters if the concept is revisited: source records, customer annotations, and any corrections need distinct ownership and provenance.

English-only presentation was the proposed first step, with an explicit note that roll languages vary by state. Maps based on pincodes and locality polygons were listed as possible future explorations, not implemented features.

## Data model sketched by the original project

The original notes named the following fields. This is a design inventory, not a claim that all fields were available, normalized, or safe to publish.

| Group | Fields in the original notes |
| --- | --- |
| Elector | `number`, `id`, `elector_name`, `father_or_husband_name`, `husband` (described as a dummy field), `house_no`, `age`, `sex` |
| Electoral geography and source | `ac_name`, `parl_constituency`, `part_no`, `year`, `state`, `filename` |
| Location | `main_town`, `police_station`, `mandal`, `revenue_division`, `district`, `pin_code` |
| Polling station | `polling_station_name`, `polling_station_address` |
| Aggregate counts | `net_electors_male`, `net_electors_female`, `net_electors_third_gender`, `net_electors_total` |

A future implementation would need to decide which fields are essential for finding a record, which are appropriate to display, and how provenance, versioning, language, and corrections work. It should not assume that a field's presence in the old schema establishes permission to distribute it.

The old notes pointed to [India pincodes](https://github.com/justinelliotmeyers/INDIA_PINCODES) and [India locality polygons](https://github.com/justinelliotmeyers/India_Locality_Polygons) as possible map inputs. Those links are research leads, not incorporated assets or a recommendation to ship maps.

## What the old code actually demonstrated

The 2021 app had a state/year/constituency selector, a searchable table, account screens, and a Razorpay checkout attempt. The backend exposed endpoints for distinct states, years, and constituencies, and returned up to 100 records for a sample query. The interface requested that sample and showed it in a table.

The old README's 1,000-row sample, full-roll delivery after payment, constituency entitlements, and customer-specific annotation storage were not implemented end to end. The checkout UI contained placeholder totals; payment response handling did not grant access to records. The old app also inherited many unrelated dashboard-template pages. Treat it as an exploration of the flow, not as production infrastructure.

## The public reference implementation

The site in `site/` deliberately keeps only the navigation and table interaction. It generates 144 obviously fictitious records in the browser and supports dependent filters, search, sorting, pagination, and CSV export. It has no backend, login, payment integration, or real-data import. Its value is as a runnable wireframe and a set of small data operations that a future project can inspect or replace.

## Questions for a future real-data version

1. Who is the intended user, and what concrete task should they finish faster than with existing sources?
2. What data can be lawfully obtained, retained, displayed, exported, and updated? What source restrictions apply?
3. What should the free preview reveal? A row count or field summary may be more appropriate than identifiable sample rows.
4. If access is sold by constituency, how are entitlements, refunds, expiry, and delivery verified server-side?
5. How should source records, customer-only annotations, and corrections be stored and audited separately?
6. How do transliteration, non-English scripts, inconsistent geography, and changes across roll years affect search?
7. What is the minimum product that validates demand before accounts, payments, and a large ingestion pipeline are built?

These are design questions, not endorsements of the old commercial or data-access model. The next real-data build should answer them before inheriting any implementation choices.
