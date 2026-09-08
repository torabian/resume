project = resume

.PHONY: default build defs run tidy clean link move

# Rebuilds defs from every *.emi.yml, then builds the binary. Same shape as
# ../nima/Makefile's default target.
default: build

# Regenerates every module's defs (entities/DTOs/actions) from its own
# *.emi.yml. resume must compile before materialized - Materialized.emi.yml
# targets resumedefs.{WorkExperience,Skill,...}Entity cross-module (see its
# own doc comment), so those types have to exist first. Add one
# `emi compile --path ...` line per module here as more *.emi.yml files show
# up (see ../nima/Makefile's own `defs` target).
defs:
	emi compile --path ./modules/resume/Resume.emi.yml && \
	emi compile --path ./modules/materialized/Materialized.emi.yml

build:
	go mod tidy && \
	go build -ldflags "-s -w" -o ./app ./cmd && \
	echo "Binary built: ./app"

run: build
	./app

tidy:
	go mod tidy

clean:
	rm -f ./app

# Imports the fireback ui package sources into ui/fireback-packages, same
# mechanism as ../nima/Makefile's own `link`/`move` targets. `link` symlinks
# ../fireback/ui/packages in place (fast, edits in fireback show up live);
# `move` copies it instead and reinstalls ui's node_modules, which is what
# you want for a real build (npm workspaces don't resolve well through a
# symlinked workspace member on every setup).
link:
	rm -rf ui/fireback-packages && ln -s ../../fireback/ui/packages ui/fireback-packages

move:
	rm -rf ui/fireback-packages && cp -rf ../fireback/ui/packages ui/fireback-packages && cd ui && rm -rf node_modules && npm i -f
