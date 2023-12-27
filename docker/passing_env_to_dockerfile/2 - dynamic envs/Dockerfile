FROM alpine:latest

ARG name

ENV env_name $name

RUN echo $name

COPY greetings.sh .

RUN chmod +x /greetings.sh

CMD ["/greetings.sh"]
