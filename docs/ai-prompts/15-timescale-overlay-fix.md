# Timescale overlay styling correction

## Request

> this component doesn't match the sketch

The supplied screenshot shows the expanded Timescale menu using default ng-select
styles and a narrow width.

## Cause and correction

ng-select 24 renders the menu in a CDK overlay outside the select host. The previous
descendant CSS selector never matched. Give this overlay an explicit
`timeline-scale-menu` panel class, target that class globally, and prevent the
71px overlay pane from flex-shrinking the measured 200px menu.

Use the existing View Selection measurements in
[the video style review](../design/video-style-review.md). Preserve the three
required scales and existing selection/keyboard behavior. Add browser regression
checks at 1280px and 390px for width, label alignment, 5px gap, 28px options,
regular selected text, and successful zoom selection without losing orders.
