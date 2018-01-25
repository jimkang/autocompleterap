HOMEDIR = $(shell pwd)
USER = bot
SERVER = smidgeo
SSHCMD = ssh $(USER)@$(SERVER)
PROJECTNAME = autocompleterap
APPDIR = /opt/$(PROJECTNAME)

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt --exclude node_modules/
	$(SSHCMD) "cd $(APPDIR) && npm install"

test:
	node tests/basictests.js
	node tests/filtertests.js

run:
	node autocompleterap.js

dry-run:
	node autocompleterap.js --dry

template-offsets:
	node getfilelineoffsets.js templates.txt > templatelineoffsets.json

prettier:
	prettier --single-quote --write "**/*.js"
