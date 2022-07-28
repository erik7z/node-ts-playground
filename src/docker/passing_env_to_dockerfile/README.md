# [How to Pass Environment Variable Value into Dockerfile](https://www.baeldung.com/ops/dockerfile-env-variable)

```sh
# build the image:
docker build -t baeldung_greetings .

# run it:
docker run baeldung_greetings
#> Hello

# Passing Dynamic Environment Values
docker build -t baeldung_greetings --build-arg name=Baeldung .

```
