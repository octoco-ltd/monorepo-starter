# Build the docker image with:
#
# ```
# nx docker-build rest-template
# ```
#
# Run the container with:
#
# ```
# docker run -it --init \
#   -p 3000:3000 \
#   -e DATABASE_URL='mongodb://host.docker.internal:27017/switch-energy?directConnection=true' \
#   rest-template
# ```
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system rest-template && \
          adduser --system -G rest-template rest-template

# TODO: At some point we should work out how to prune the global package.json,
# once this monorepo starts to get bigger. For now this is probably fine.
COPY dist/packages/rest-template rest-template
COPY package*.json rest-template/
COPY packages/rest-template/prisma rest-template/prisma
RUN chown -R rest-template:rest-template .
RUN npm --prefix rest-template --omit=dev -f install
RUN npx prisma generate

CMD [ "node", "rest-template/main" ]
