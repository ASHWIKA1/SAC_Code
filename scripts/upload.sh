#!/bin/bash
HOST="test-sacgotek.test1-technosprint.online"
USER="u841409365"
PASS='Eash@2005'

echo "Uploading extract.php..."
curl --ftp-create-dirs -T extract.php ftp://$HOST/public_html/extract.php --user $USER:$PASS

echo "Uploading dashboard_only.zip..."
curl --ftp-create-dirs -T dashboard_only.zip ftp://$HOST/public_html/dashboard_only.zip --user $USER:$PASS

echo "Upload complete!"
echo "Now visit http://$HOST/extract.php to finish the deployment."
