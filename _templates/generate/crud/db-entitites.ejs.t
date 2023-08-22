---
to: packages/@octoco/shared/src/db.module.ts
inject: true
after: User,
eof_last: false
---
            <%=h.changeCase.pascalCase(name)%>,
