// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import AxiomError from 'axiom/core/error';

/** @typedef ExecuteContext$$module$axiom$bindings$fs$execute_context */
var ExecuteContext;

/** @typedef JsExecutable$$module$axiom$fs$js_executable */
var JsExecutable;

var IMPORT_CMD_USAGE_STRING = 'usage: script <url>';

/**
 * An executable to import cross origin script into the shell.
 *
 * @this {JsExecutable}
 * @param {ExecuteContext} cx
 */
var main = function(cx) {
  cx.ready();
  var arg = cx.arg;

  if (!arg['_'] || (arg['_'].length < 1) || arg['h'] || arg['help']) {
    cx.stdout(IMPORT_CMD_USAGE_STRING + '\n');
    return Promise.resolve(null);
  }

  var url = arg['_'][0];

  // TODO(grv): add timeout as a command line argument.

  var s = document.createElement('script');
  s.src = url;
  s.type = 'text/javascript';

  var state = 0;
  var axiom = {};
  __axiomExport__(axiom);

  s.axiom = axiom;

  s.ready = function(callback) {
    if (!state) {
      callback(cx, axiom);
      cx.closeOk();
      state = 1;
    } else if (state == 1) {
      return cx.closeError(new AxiomError.Runtime(
          'Duplicate call to script callback.'));
    } else {
      cx.closeError();
      return cx.closeError(new AxiomError.Runtime(
          'Import script callback called after a timeout.'));
    }
  };

  document.head.appendChild(s);

  setTimeout(function() {
    // import script request timed out.
    if (!state) {
      state = 2;
      return cx.closeError(new AxiomError.Runtime(
          'Import script requet timed out.'));
    }
  }, 5000);

  return cx.ephemeralPromise;
};

export {main};
export default main;

/**
 * Accept any value for the execute context arg.
 */
main.argSigil = '%';
