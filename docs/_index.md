![](https://img.shields.io/npm/v/quilk.svg) ![](https://img.shields.io/npm/dt/quilk.svg)

*Est. 4th Sept. 2016*

*If anyone fancies helping [evolve](https://github.com/johnc1984/quilk/blob/master/TODO.md) quilk give me a shout, many [skilled] hands make light work.*

---

## Intro
Use a single quilk.json file locally, on a dev server, a staging server and production server. Use quilk to build your web applications. Ping messages via email or webhooks (eg Slack) when builds are complete or failed.

Yet another module runner designed to compile SASS and JS files and rsync... in short, speed. I needed a super lightweight solution that worked fast on both low spec machines with a HDD, as well as the high spec with SSD machines. The current tools available were killing the build speed on an i5 HDD machine, especially when throwing watchers plus an IDE into the mix... a lot of time sitting and waiting.

Quilk began as a single script which utilized the popular node-sass npm package plus the nice and light concat-files npm package together with the snappy chokidar file watcher. The result was a working solution for lower spec machines that was still rapid fast and didn't require `npm install` to download the entire internet.

As quilk grew and was being used in more projects, the configuration nature of quilk started to emerge. Using the same script on different projects but with just altering a few lines of a JSON file meant projects were setup in no time, and it was no longer possible to create a whacky build file... Roll forward to today and I use quilk in many projects using most of the std tools from sass to less to browserify.

I only wrapped this into an "official" npm package recently to allow easier installation on other machines other than my own.

#### Latest release
- Latest node-sass added to the stack. NB: if you are using quilk on ubuntu 16 + node 6.9.1 + npm 3.10.8... ensure you completely uninstall quilk from your system before installing the latest version, then double check is really is gone from your global node_modules directory (`npm root -g` to discover the location). This may or may not affect you, but i recently migrated a server from Ubuntu 14 -> 16 which I think left some dangling files maybe... which resulted in a quilk upgrade hanging. Anyway, as every support guy ever said.. "Have you tried turning it on and off again" :D :D


#### Coming Next
- Improve the docs. Quilk now offers a lot of out of the box functionality but the documentation is not great, this will be coming it later releases.