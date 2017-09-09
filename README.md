# Repo In The Wild
[![Download from Chrome Webstore](promo/chromestore_badge.png)](https://chrome.google.com/webstore/detail/repo-in-the-wild/aikcllliacgpbnpalenkkmhciaekgfdl?hl=en-US&gl=DE)


![Screenshot in use](promo/screenshot.png)

## About
This browser extension checks for publicly exposed repositories and changes it's icon to the logo of the detected repository type.

It accomplishes this by checking for common paths, like ```https://example.com/.git/config```.

Currently supported are:
 * Git
 * Subversion
 * Mercurial

If you detect a website with a publicly exposed repository, please contact the owner of the website. If it's your own website you should move the repository folder (.git, .svn, .hg) out of the web root or at least block it using an ACL.

For more information about why it's bad to expose a repository like this, go to https://en.internetwache.org/dont-publicly-expose-git-or-how-we-downloaded-your-websites-sourcecode-an-analysis-of-alexas-1m-28-07-2015/

