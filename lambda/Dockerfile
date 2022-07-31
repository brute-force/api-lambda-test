FROM public.ecr.aws/lambda/nodejs:16 as builder
WORKDIR /usr/app
COPY app.ts interfaces.ts package*.json /usr/app/
RUN npm install
RUN npm run compile
# RUN npm ci --production

FROM public.ecr.aws/lambda/nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=builder /usr/app/package.json ${LAMBDA_TASK_ROOT}/package.json
COPY --from=builder /usr/app/package-lock.json ${LAMBDA_TASK_ROOT}/package-lock.json
COPY --from=builder /usr/app/*.js* ./

# FROM public.ecr.aws/lambda/nodejs:16
# COPY *.js* package*.json ./
# RUN npm install

CMD ["app.lambdaHandler"]
