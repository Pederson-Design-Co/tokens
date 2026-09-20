# RULES.md — tokens principles

Rules that apply to this project and not to others. `_Playbook/PRINCIPLES.md` outranks this
file; anything here that would also be true of another project belongs there instead.

## 1. North star

One set of design decisions, stated once as values, rendered by every project. A color, a
spacing step, a type size, a radius, a motion duration or curve is chosen here and nowhere
else; a project that needs a value this package does not have adds it here, through a gate,
never locally. Changing a value here changes every project on its next update, which is the
point.

## 2. A token is a purpose, not a value

A token's name says what it is for, never what it is: `color.action.primary`, not
`color.blue600`; `motion.fast`, not `motion.150`. The raw value lives in exactly one place,
beside its name. Changing a value never means renaming a token (studio RULES.md §5 says the
same from the consumer's side; this file is where it is enforced).

## 3. Platform-neutral, or it does not belong here

A value here must make sense to a web page and to a phone app alike: a hex color, a number
of points, a millisecond count, a curve as four numbers. Nothing here imports React, React
Native, Tailwind, or any framework; nothing here is a component or a style class. How a value
is rendered is each project's job.

## 4. Every color has a light and a dark value

From the day a color token exists it carries both, and both carry their measured contrast
ratio against the surface they sit on. A color with one value is not a token yet. (Kestrel's
inverse text tiers are the starting point for dark; studio's backlog item on the Kestrel
color decisions holds what is carried over.)

## 5. Versioning

The package follows semver. Renaming or removing a token is a major version; changing a value
is a minor version; adding a token is a minor version. A consumer pins a version and updates
deliberately, so a change here can never surprise a project mid-build.

## 6. Delivery

Consumers install from GitHub (`github:Pederson-Design-Co/tokens`), not from npm, until
something needs to be public for people outside Pederson Design Co (BACKLOG T-01). Work
happens on a branch named after the task; nothing merges until Sam says "okay to merge" for
that commit.

## Never

- Never a framework import, a component, or a style class.
- Never a value in a consumer that this package could hold.
- Never a color without a dark value and a measured ratio.
- Never a rename or removal outside a major version.
