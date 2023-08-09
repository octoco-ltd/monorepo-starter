---
to: packages/@octoco/rest/src/app.module.ts
inject: true
after: GeneratorModule,
eof_last: false
---
    <%=h.changeCase.pascalCase(name)%>Module,
