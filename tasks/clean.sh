echo 'Cleaning...'
ls -A | grep --invert-match dist | grep --invert-match -F -w .git | xargs rm -rf # Remove all but "dist" and ".git"
mv dist/* .
echo 'Cleaning done'
ls -ltra