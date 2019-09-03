# Remove all but "dist"
ls | grep --invert-match dist | xargs rm -rf

mv dist/* .
git checkout gh-pages
git push origin gh-pages