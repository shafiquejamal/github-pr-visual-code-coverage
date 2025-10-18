## Table of Content
- [Installation](#installation)
- [Setup](#setup)
- [PR Examples](#pr-examples)


### Installation
- **Step 1** - Release a version using [release.yaml](https://github.com/shafiquejamal/github-pr-visual-code-coverage/actions/workflows/release.yaml) workflow (click the `Run workflow` button)
- **Step 2** - Go to [release page](https://github.com/shafiquejamal/github-pr-visual-code-coverage/releases) and download `github-browser-extension*.zip` from **Assets**
- **Step 3** - Extract the zip file using your file manager/explorer.
- **Step 4** - `Load unpacked` the extracted folder in **`chrome://extensions/`** to install the plugin locally.
- **Step 5** - At the **upper right** corner of your chrome browser, click the **puzzle icon**.
- **Step 6** - Pin the **Github PR Code Coverage** extension.
- **Step 7** - [Create github access token](https://github.com/settings/tokens/new) with **`repo scope`**
- **Step 8** - Click the pinned **Github PR Code Coverage** at the **upper right** corner of your browser. After clicking the pinned extension, a form will pop up asking to save your `github access token`
- **Step 9 (last)** - Paste and save your `github access token` created solely for this plugin.


### Setup

These are the github workflows that upload coverage file as artifact.

You need to add a workflow file from these templates specific to your project
because **Github PR Code Coverage** extension needs these file for it to highlight the PR files.

**Test workflow files template:**
- *`Pytest`* [.github/workflows/test.yaml](./.github/example/workflows/pytest.yaml)
- *`Jest`* [.github/workflows/test.yaml](./.github/example/workflows/jest.yaml)
- *`Rust Test`* [.github/workflows/test.yaml](./.github/example/workflows/rusttest.yaml)
- *`Go Test`* [.github/workflows/test.yaml](./.github/example/workflows/gotest.yaml)


### PR Examples

- [rust pr example](https://github.com/gelocraft/rust-test-example/pull/2/files)
- [golang pr example](https://github.com/gelocraft/go-test-example/pull/6/files)
- [pytest pr example](https://github.com/gelocraft/pytest-example/pull/2/files)
- [jest pr example](https://github.com/gelocraft/jest-example/pull/1/files)
