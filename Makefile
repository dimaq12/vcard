up:
	docker compose up -d --build
	@echo "Services are up and running. Visit http://localhost:7777"

down:
	docker compose down
	@echo "Services have been stopped."

logs:
	docker compose logs -f

rebuild:
	docker compose down
	docker compose up -d --build
	@echo "Services rebuilt and restarted. Visit http://localhost:7777"
