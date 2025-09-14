# Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	## __WORK IN PROGRESS__
-->
## 0.8.1 (2022-03-03)
Upgrade dependencies

## 0.8.0 (2022-02-04)
Add the install option `ignoreScripts` which prevents execution of pre/post/install scripts for Yarn Classic and npm

## 0.7.0 (2021-09-15)
* Add support for Yarn Berry (v2+)
* `packageManagers.yarn` now defaults to Yarn Berry. To explicitly use Yarn Classic (v1), use `packageManagers.yarnClassic`.

## 0.6.0 (2021-05-03)
Add option `setCwdToPackageRoot` to automatically set `cwd` to the found package's root dir

## 0.5.0 (2021-05-03)
Add support for additional args that are passed as-is to the package manager.

## 0.4.0 (2021-05-03)
Install commands without packages (`yarn install` / `npm install`) no longer install `devDependencies` by default. To turn this back on, set the `environment` property of the package manager instance to `development`.

## 0.3.1 (2021-04-27)
Fix: `yarn.overrideDependencies` now correctly looks for a `yarn.lock` to determine the root directory

## 0.3.0 (2021-04-26)
Add support for overriding transient dependencies

## 0.2.0 (2021-04-24)
Support directories without a lockfile

## 0.1.0 (2021-04-23)
Initial release
