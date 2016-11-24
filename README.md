# The Thingdom — Archived

This archive is a snapshot of the _full_ Thingdom website as it existed, running against a real database, just before we retired it.

This static snapshot is what is now served at [TheThingdom.com](http://www.thethingdom.com/).

This snapshot will never be re-generated, but for educational purposes, it was generated via the nice tool [HTTrack](http://www.httrack.com/), like so:

```
$ httrack

Welcome to HTTrack Website Copier (Offline Browser) 3.48-21
Copyright (C) 1998-2015 Xavier Roche and other contributors
To see the option list, enter a blank line or try httrack --help

Enter project name :thingdom-archive

Base path (return=/Users/aseemk/websites/) :/Users/aseemk/Projects/Thingdom/

Enter URLs (separated by commas or blank spaces) :www.thethingdom.com

Action:
(enter)	1	Mirror Web Site(s)
	2	Mirror Web Site(s) with Wizard
	3	Just Get Files Indicated
	4	Mirror ALL links in URLs (Multiple Mirror)
	5	Test Links In URLs (Bookmark Test)
	0	Quit
: 2

Proxy (return=none) :

You can define wildcards, like: -*.gif +www.*.com/*.zip -*img_*.zip
Wildcards (return=none) :

You can define additional options, such as recurse level (-r<number>), separed by blank spaces
To see the option list, type help
Additional options (return=none) :

---> Wizard command line: httrack www.thethingdom.com -W -O "/Users/aseemk/Projects/Thingdom/thingdom-archive"  -%v
```

The full HTTrack output and metadata can be found in the [`.httrack`](./.httrack) folder. (One exception: `hts-cache/new.zip` was excluded because it was over GitHub's [100 MB individual file size limit](https://help.github.com/articles/working-with-large-files/).)
