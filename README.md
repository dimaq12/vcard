# Quick Start – V‑Card demo (10 sec)

1. **Clone** this repository  
   ```bash
   git clone <your‑fork‑url> vcard && cd vcard
   ```

2. **Build & run** everything with Docker Compose  
   ```bash
   make up
   ```
   The stack contains:
   - **frontend** – Next.js on port `3000`
   - **backend**  – NestJS API on port `4000`
   - **reverse‑proxy** – Nginx entry point (mapped to `7777`)

3. Open <http://localhost:7777> in your browser – done!

---

## One‑liners

| Action             | Command                   |
|--------------------|---------------------------|
| rebuild & run      | `make up`                 |
| stop containers    | `make down`               |
| follow logs        | `make logs`               |
| rebuild from clean | `make rebuild`            |

---

## Included Makefile

```makefile
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
```

---

## Requirements

* Docker ≥ 20.10  
* Docker Compose plugin (shipped with modern Docker)  
* `make` (pre-installed on macOS/Linux; install [Make for Windows](https://gnuwin32.sourceforge.net/packages/make.htm) if needed)

That’s it – happy hacking!