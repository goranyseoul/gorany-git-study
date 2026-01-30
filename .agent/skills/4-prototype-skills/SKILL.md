---
name: 9-web-prototype-skills
description: Executable skills for Web Prototyping (Low-Token Mode).
author: troll
modified_by: troll
created: 2026-01-27
modified: 2026-01-30
---

# Skill: scaffold-project
Description: Generates the full project structure (Index, CSS, JS) safely.
**Implementation**:
Run the following command:
```bash
node .agent/tools/9-web-prototype-skills/scaffold.js
```
*Note: This script automatically handles backups and file creation.*

# Skill: bundle-project
Description: Bundles the current project into a single `preview.html`.
**Implementation**:
Run the following command:
```bash
node .agent/tools/9-web-prototype-skills/bundle.js
```
*Note: Run this after ANY modification to the source files.*
