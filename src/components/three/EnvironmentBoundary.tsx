'use client';

import { Component, type ReactNode } from 'react';

/**
 * Keeps a failed environment map from taking the page down with it.
 *
 * `<Environment preset="city" />` fetches a ~1.5MB HDRI from drei's CDN at
 * runtime. Measured in the browser: when that fetch fails, the error is thrown
 * inside the render tree and the whole `/engineering` route unmounts into the
 * error boundary — a blank page because a decorative reflection map did not
 * arrive from a third-party host.
 *
 * The scene lights itself with an ambient and two directional lights; the
 * environment map only adds image-based reflection on top. So the honest
 * failure mode is "slightly flatter model", not "no page". This renders
 * nothing when the map fails and leaves the lights doing their job.
 *
 * A class component because that is still the only way to catch a render
 * error in React, and it works inside a react-three-fiber tree the same way it
 * does in the DOM tree.
 */
export class EnvironmentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Environment map unavailable; falling back to scene lights.', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
