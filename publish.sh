COMMIT_TEXT=``
VERSION_COMMIT=$(git log -1 --oneline | grep -a "release bump");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="patch"; fi;
VERSION_COMMIT=$(git log -1 --oneline | grep -a "release patch");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="patch"; fi;
VERSION_COMMIT=$(git log -1 --oneline | grep -a "release minor");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="minor"; fi;
VERSION_COMMIT=$(git log -1 --oneline | grep -a "release major");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="major"; fi;

echo TRAVIS_SECURE_ENV_VARS = $TRAVIS_SECURE_ENV_VARS
echo TRAVIS_BRANCH = $TRAVIS_BRANCH
echo TAG_COMMIT = $TAG_COMMIT
chmod 600 ~/.ssh/id_rsa
echo "//registry.npmjs.org/:_authToken=$NPM_API_KEY" > ~/.npmrc

if [ "$TRAVIS_SECURE_ENV_VARS" = "true" ] && [ -n "$TAG_COMMIT" ]; then
	echo publishing version $TAG_COMMIT

    chmod 600 ~/.ssh/id_rsa
    eval `ssh-agent -s`
    ssh-add ~/.ssh/id_rsa

	git config user.name "OmniSharp CI"
	git config user.email "travis@omnisharp.net"

	git remote add github git@github.com:OmniSharp/omnisharp-node-client.git
    git fetch github
	git add .
	npm version $TAG_COMMIT -m "[travis] Tagging release %s"
	git push github master
	git push github --tags
	npm publish
fi;

if [ "$TRAVIS_SECURE_ENV_VARS" = "true" ] && [ "$TRAVIS_BRANCH" = "master" ] && [ -z "$TAG_COMMIT" ]; then
	npm --no-git-tag-version version minor
	echo publishing npm tag "@next"
	# npm publish --tag next
fi;
