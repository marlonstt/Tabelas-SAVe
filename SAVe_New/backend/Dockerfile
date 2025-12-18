# Build stage - Cache Buster v2
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
ENV GOTOOLCHAIN=auto
RUN go mod download

COPY . .

RUN go mod tidy
RUN go build -o main ./cmd/server

# Run stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
