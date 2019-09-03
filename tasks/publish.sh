git remote add gh-publish https://${GIT_TOKEN}@github.com/stryker-mutator/stryker-mutator.github.io.git
git checkout --track -b gh-pages gh-publish/master
ls -A | grep --invert-match dist | grep --invert-match -F -w .git | xargs rm -rf # Remove all but "dist" and ".git"
mv dist/* .
git add .
git commit -m "Publish"
git push