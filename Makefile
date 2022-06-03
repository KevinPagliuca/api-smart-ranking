include .env

.PHONY: up
up:
  ifeq ($(NODE_ENV), development)
	  docker-compose up
  else
	  docker-compose up -d
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
