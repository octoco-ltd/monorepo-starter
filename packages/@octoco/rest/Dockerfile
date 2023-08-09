# Build the docker image:
#   docker build .. -t octoco-rest
#
# Run the image locally:
#   docker run -it --init \
#     -p 8080:8080 \
#     -e DATABASE_URL='mongodb://host.docker.internal:27017' \
#     -e ENV='dev' \
#     octoco-rest
# ```
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /workspace

RUN addgroup --system octoco-rest && \
          adduser --system -G octoco-rest octoco-rest

COPY rest/dist/bundle.js .
RUN chown -R octoco-rest:octoco-rest .

CMD [ "node", "bundle.js" ]

