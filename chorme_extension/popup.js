// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let browsingHistory = document.getElementById('browsingHistory');



browsingHistory.onclick = function(element) {
	chrome.tabs.create({active: true, url: 'http://localhost:3000'});
};
