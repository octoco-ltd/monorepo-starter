---
to: packages/@octoco/shared/src/index.ts
inject: true
after: db.module.js
eof_last: false
---
export * from './<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.entity.js';
export * from './<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.dto.js';
export * from './<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.service.js';
