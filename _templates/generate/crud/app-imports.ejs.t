---
to: packages/@octoco/rest/src/app.module.ts
inject: true
after: GeneratorModule
eof_last: false
---
import { <%=h.changeCase.pascalCase(name)%>Module } from './crud/<%=h.changeCase.paramCase(name)%>/<%=h.changeCase.paramCase(name)%>.module.js';
