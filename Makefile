SHELL := /bin/bash

VIP_VAULT_DIR ?= $(HOME)/Desktop/VIP
FGPACK_DIR ?= exports/fgpack
FGPACK_PATH ?= $(FGPACK_DIR)/latest.fgpack

.PHONY: up down logs backup verify test-policy

up:
	VIP_VAULT_DIR="$(VIP_VAULT_DIR)" docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=100

backup:
	mkdir -p "$(FGPACK_DIR)"
	node scripts/fgpack-export.mjs --vault-root "$(VIP_VAULT_DIR)" --out "$(FGPACK_PATH)"

verify:
	node scripts/fgpack-verify.mjs --pack "$(FGPACK_PATH)"

test-policy:
	yarn vitest run shared/src/__tests__/policyCore.test.ts
