include .env

.PHONY: up
up:
  ifeq ($(NODE_ENV), development)
	  make copy && docker-compose up
  else
	  make copy && docker-compose up -d
  endif


.PHONY: down
down:
  ifeq ($(NODE_ENV), development)
	  docker-compose down
  else
	  docker-compose down
  endif


.PHONY: logs
logs:
  ifeq ($(NODE_ENV), development)
	  docker-compose logs --follow
  else
	  docker-compose logs
  endif

.PHONY: copy
copy:
  ifeq ($(NODE_ENV), development)
	  cp -r constants.template ./gateway/src/shared/env/constants.ts
	  cp -r constants.template ./admin-service/src/shared/env/constants.ts
  else
	  echo "Copying files to docker container"
  endif

