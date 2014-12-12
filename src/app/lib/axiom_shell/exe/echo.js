// Copyright (c) 2014 The Axiom Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Simple callback for a JsExecutable which echos the argument list to stdout
 * and exits.
 */
export var main = function(cx) {
  cx.ready();
  cx.stdout(cx.arg + '\n');
  return Promise.resolve(null);
};

export default main;

/**
 * Accept any value for the execute context arg.
 */
main.argSigil = '*';
