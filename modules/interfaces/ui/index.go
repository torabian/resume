package resumeui

import "embed"

// ResumeUI is the compiled ui/ front-end (npm run build output, ui/dist),
// embedded here by `make embed-ui` - see ../../../Makefile's embed-ui target
// and cmd/main.go's PublicFolders entry, which mounts this at "/" the same
// way ../fireback/modules/interfaces/fireback-manage and .../selfservice
// mount their own compiled front-ends.
//
// embed-ui overwrites every file in this directory (except this one, which
// it restores via `git checkout` right after) with a fresh copy of
// ui/dist, so nothing else should be hand-edited here.
//
//go:embed *
var ResumeUI embed.FS
