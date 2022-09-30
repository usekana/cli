# Kana CLI

Command-line interface for managing Kana packages and features.

### 💾 Install

To make the `kana` command available in your terminal install the package globally with npm:

```bash
npm install -g @usekana/cli
```

### 🔑 Add API keys

Add the following private KANA API keys as variables to a `.env` file in your project:

```
KANA_DEV_KEY="prv_test_..."
KANA_LIVE_KEY="prv_live_..."
```

### 🦭 Pull configuration

Pull your current Kana configuration to your project by running the following in the root directory of your project:

```bash
kana pull
```

This autogenerates the `./kana/kana.dev.yaml` file which you can use to configure future package and feature changes.

### 🥾 Bootstrap a new project

If you're just getting started, check out an example Kana config file by running:

```bash
kana bootstrap
```

### 👩‍🎓 Validate configuration

If you want to check whether your configuration is correctly structured or if you introduced breaking changes. run:

```bash
kana validate
```

### 🚀 Publish configuration

If you wish to publish your updated `kana.yaml` file to production, run the following command:

```bash
kana publish
```
