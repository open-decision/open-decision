# Introduction

The Open Decision Design System provides a comprehensive baseline for the Design, UX and Implementation of Open Decision Components, Systems and Design Tokens.
Under the hood it uses stitches for styling. All components and systems are build upon the design tokens provided to stitches.

## Shared Styling API

All components share the same design tokens. Local overrides can be done with the styled function exported by this package or directly on most components via the css prop (extended style prop).
The main benefit here is the availability of all design tokens. In cases where only css should be shared between components the css function can be used to create reusable css classes while maintaining access to the Design Tokens.
