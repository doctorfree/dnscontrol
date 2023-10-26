# DNSControl

Development repository for `DNSControl` actions workflows.

Currently in development mode, this configuration is setup
to manage the [neoman.dev](https://neoman.dev) domain on `Cloudflare`.

`DNSControl` is an opinionated platform for seamlessly managing your
DNS configuration across any number of DNS hosts, both in the cloud
or in your own infrastructure.

## Table of Contents

- [Process](#process)
- [DNSControl Actions](#dnscontrol-actions)
  - [Workflows currently in place for this repository](#workflows-currently-in-place-for-this-repository)
  - [DNSControl actions workflows](#dnscontrol-actions-workflows)
  - [DNSControl actions specifications](#dnscontrol-actions-specifications)
- [Configuration](#configuration)
  - [Test DNSControl configuration](#test-dnscontrol-configuration)
  - [DNSControl configuration templates](#dnscontrol-configuration-templates)
- [Runners](#runners)
- [Secrets](#secrets)
- [Utility Scripts](#utility-scripts)
- [References](#references)

## Process

Manage the DNS configuration for the configured providers by following these steps:

- Fork the repository or create a new branch of the repository
- Make your changes to the fork or branch
- Commit and push those changes to your fork or branch
- Examine the `check` and `preview` actions for your commits
- Create a pull request
- Review the pull request, commenting and debating with your peers
- When approved and the PR is merged:
  - The [deploy.yml](.github/workflows/deploy.yml) workflow will be triggered
  - `deploy.yml` checks out the default branch and previews the changes
  - Changes are pushed up to the DNS provider(s)
- Verify the provider's DNS configuration includes your changes
- `git pull` to update your fork or branch

The [mkrelease](mkrelease) script can be used to create releases. To create a
release, first edit the [VERSION](VERSION) file and bump the version or release
number. Edit the [ReleaseNotes.md](ReleaseNotes.md) and execute `./mkrelease`.

### Merge rollback

If an incorrect DNS configuration gets pushed by a merge, it can be rolled back
using the [bin/rollback](bin/rollback) script. This action must be performed
manually by an user with appropriate repository permissions and with the
`Cloudflare` API token.

The `bin/rollback` script should be invoked with no arguments. It will retrieve
the git index of the previous merge, revert to that index, commit and push to
the git repository, and use `dnscontrol` to push to `Cloudflare`.

To perform a rollback:

```bash
git clone https://gs.hornblower.com/ron.record/dnscontrol
cd dnscontrol
bin/rollback
```

### Command Line Merge

Merges can be performed from the command line either with `git` or `tea`.

With `tea`:

```bash
git clone https://gs.hornblower.com/ron.record/dnscontrol
cd dnscontrol
bin/list_prs
bin/merge_pr <index>
```

With `git`:

#### Step 1

From your project repository, check out a new branch and test the changes.

```bash
git checkout -b test main
git pull origin test
```

#### Step 2

Merge the changes and update on `Github`.

```bash
git checkout main
git merge --no-ff test
git push origin main
```

## DNSControl Actions

### Workflows currently in place for this repository

* [.github/workflows/check.yml](.github/workflows/check.yml): On `push` or `pull_request`, perform `dnscontrol check`
* [.github/workflows/preview.yml](.github/workflows/preview.yml): On `push` or `pull_request`, perform `dnscontrol preview`
* [.github/workflows/deploy.yml](.github/workflows/deploy.yml): On `pull_request` merge, perform `dnscontrol push`

### DNSControl actions workflows

* [actions/check.yml](actions/check.yml): On `push` or `pull_request`, perform `dnscontrol check`
  * [actions/check-dl.yml](actions/check-dl.yml): Same as `check.yml` but runs in a docker container
* [actions/deploy.yml](actions/deploy.yml): On merge into default branch, deploy the DNS changes
  * [actions/deploy-dl.yml](actions/deploy-dl.yml): Same as `deploy.yml` but runs in a docker container
* [actions/lint.yml](actions/lint.yml): On `push` or `pull_request`, lint `dnsconfig.js` configuration file using `ESLint`, and preview the DNS changes
* [actions/preview.yml](actions/preview.yml): On `push` or `pull_request`, perform `dnscontrol preview`
  * [actions/preview-dl.yml](actions/preview-dl.yml): Same as `preview.yml` but runs in a docker container
* [actions/push.yml](actions/push.yml): On `push`, perform `dnscontrol push`
* [actions/rollback.yml](actions/rollback.yml): manually revert the previous commit(s) and perform `dnscontrol push` (not currently in use, see `bin/rollback`)
* [actions/update.yml](actions/update.yml): On `push`, preview changes and manually perform `dnscontrol push`

### DNSControl actions specifications

* [actions/dnscontrol-action.yml](actions/dnscontrol-action.yml): Spec for the `DNSControl` action
* [actions/dnscontrol-install-action.yml](actions/dnscontrol-install-action.yml): Spec for the install `dnscontrol` action

## Configuration

Once your provider credentials are in place, create a draft configuration with, e.g:

```bash
dnscontrol get-zones --format=js --out=draft.js cloudflare - all
```

This should create the file `draft.js` which can serve as the starting point
for `dnsconfig.js`.

### Test DNSControl configuration

* [creds.json](creds.json): `DNSControl` test credentials
* [dnsconfig.js](dnsconfig.js): `dnscontrol` test configuration

### DNSControl configuration templates

* [templates/README.md](templates/README.md): `DNSControl` templates info
* [templates/creds.json](templates/creds.json): `DNSControl` credentials template
* [templates/dnsconfig.js](templates/dnsconfig.js): `dnscontrol` configuration template

## Secrets

The `Cloudflare` account ID and API token are taken from the environment:

```
"accountid": "$CLOUDFLARE_API_USER",
"apitoken": "$CLOUDFLARE_API_TOKEN"
```

Create an API token in your `Cloudflare` account.
Set the appropriate environment variables:

```bash
export CLOUDFLARE_API_USER="<your-cloudflare-account-id>"
export CLOUDFLARE_API_TOKEN="<your-cloudflare-api-token>"
export CLOUDFLARE_API_KEY="<your-cloudflare-api-key>" # Only needed if no API token
```

The `dnscontrol` Github workflow actions use Github secrets to set these
in the runner environment. In Github go to `Settings` -> `Actions` -> `Secrets`
and create a `CLOUDFLARE_API_TOKEN` secret containing your `Cloudflare` API token.

The `dnscontrol` command also accepts a `Cloudflare` account id and API key
which can be used instead of the API token for some actions. To make these
available for Github actions,
create a `CLOUDFLARE_API_KEY` secret containing your `Cloudflare` API key and
a `CLOUDFLARE_API_USER` secret containing your `Cloudflare` account id.

**[Note:]** DO NOT commit unencrypted secrets to a public repository!
The plan is to move secrets into HashiCorp Vault. Until then, exercise caution.

### HashiCorp Vault secrets

- [Retrieving CI/CD secrets from Vault](https://developer.hashicorp.com/well-architected-framework/security/security-cicd-vault)
- [Integrate Vault with Actions](https://developer.hashicorp.com/hcp/docs/vault-secrets/integrations/github-actions)
- [Hornblower Vault Tutorials](https://gs.hornblower.com/ron.record/vault)
- Sophisticated 3 part CI/CD setup for `Vault`/`Gitea`/`Kubernetes`/`Nginx`/more
  - [Part 1 - Overview](https://koudingspawn.de/the-complete-ci-cd-part-1)
  - [Part 2 - The Components](https://koudingspawn.de/the-complete-ci-cd-part-2)
  - [Part 3 - The CI/CD pipeline](https://koudingspawn.de/the-complete-ci-cd-part-3)

## Utility Scripts

In addition to the [mkrelease](mkrelease) script used to create releases,
several utility scripts are available in the `bin` directory:

* [bin/check_json](bin/check_json): perform a check on the `creds.json` syntax
* [bin/close_pr](bin/close_pr): close a pull request
* [bin/create_pr](bin/create_pr): create a pull request
* [bin/filter-preview-output](bin/filter-preview-output): can be used to filter PR comments
* [bin/install-dnscontrol](bin/install-dnscontrol): install the latest `dnscontrol` binary release
* [bin/install-tea](bin/install-tea): install the `tea` Gitea command line interface
* [bin/list_prs](bin/list_prs): list pull requests
* [bin/list_releases](bin/list_releases): list releases
* [bin/merge_pr](bin/merge_pr): merge a pull request
* [bin/review_pr](bin/review_pr): review a pull request
* [bin/rollback](bin/rollback): revert to the previous merge and push to `Cloudflare`

## References

- [DNSControl Website](https://dnscontrol.org)
- [DNSControl Repository](https://github.com/StackExchange/dnscontrol)
- [DNSControl Documentation](https://docs.dnscontrol.org)
- [DNSControl Getting Started](https://docs.dnscontrol.org/getting-started/getting-started)
- [DNSControl template repository](https://github.com/fabriziosalmi/dnscontrol-actions)
- [Gitea act runner daemon](https://gitea.com/gitea/act_runner)
- [Hornblower Infrastructure as Code Repository](https://gs.hornblower.com/ron.record/infrastructure-as-code)
- Treating DNS Like Code
  - [Part 1: Getting Started](https://sysadmins.zone/topic/30/using-git-to-deploy-dns-changes-and-treating-dns-like-code-part-1-getting-started)
  - [Part 2: Using CI/CD to Deploy](https://sysadmins.zone/topic/33/using-git-to-deploy-dns-changes-and-treating-dns-like-code-part-2-using-ci-cd-to-deploy)
  - [Part 3: Advanced DNS Tricks](https://sysadmins.zone/topic/40/using-git-to-deploy-dns-changes-and-treating-dns-like-code-part-3-advanced-dns-tricks)
