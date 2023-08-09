---
to: packages/@octoco/models/src/db.module.ts
inject: true
after: import,
eof_last: false
---
import { <%=h.changeCase.pascalCase(name)%> } from '.';
