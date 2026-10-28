# Panel date presentation

User request: match the Sketch date format and show End Date before Start Date.

The local Sketch With Selection artboard (`653A18EF-07CE-43C4-92FE-6D66E5DE94F1`)
contains `12.30.2025` for End date and `12.23.2025` for Start date. Display and parse
MM.DD.YYYY through a panel-scoped NgbDateParserFormatter. Keep the existing adapter,
ISO calendar-string form/service models, default dates, and validation unchanged.
Move the complete field blocks so visual and keyboard order agree. Test leap-day
parsing, invalid dates, Create/Edit display values, field order, and existing flows.
