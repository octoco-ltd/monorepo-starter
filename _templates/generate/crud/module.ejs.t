---
to: packages/@octoco/rest/src/crud/<%=h.changeCase.paramCase(name)%>s/<%=h.changeCase.paramCase(name)%>.module.ts
---
import { Module } from '@nestjs/common';
import { <%=h.changeCase.pascalCase(name)%>Controller } from './<%=h.changeCase.paramCase(name)%>.controller.js';
import { <%=h.changeCase.pascalCase(name)%>Service } from '@octoco/models';

@Module({
  controllers: [<%=h.changeCase.pascalCase(name)%>Controller],
  providers: [<%=h.changeCase.pascalCase(name)%>Service],
})
export class <%=h.changeCase.pascalCase(name)%>Module {}
