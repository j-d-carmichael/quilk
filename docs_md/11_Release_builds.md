
You can configure quilk to run additional modules and commands for specific environments, eg a dev server where you want to test compressed and obfusicated code.

This is acheived with the `release_commands_or_modules` block of the quilk json. The release block can contain as many different releases as you like, eg "dev", "staging", "live".

Each block can contain either or all of the following:
1.  `pre` this is stuff that will be called before the std quilk modules.
1.  `post` this is stuff that will be called after the std quilk modules.
1.  `complete` this is stuff that will be called after the `post` and with zero errors.
1.  `error` this will be called when there is an error found in the pre, std modules, post or even complete.

Please see the kicthen sink json for a fuller example.