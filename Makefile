HOMEDIR = /var/www/autocompleterap
GITDIR = /var/repos/autocompleterap.git

test:
	node tests/basictests.js
	node tests/filtertests.js

run:
	node autocompleterap.js

dry-run:
	node autocompleterap.js --dry

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

post-receive: sync-worktree-to-git npm-install
