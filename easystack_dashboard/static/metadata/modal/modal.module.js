/*
 * Copyright 2015, Intel Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /*eslint-disable max-len */
  /**
   * @ngdoc overview
   * @name horizon.app.metadata.modal
   * @description
   *
   * # horizon.app.metadata.modal
   *
   * The `horizon.app.metadata.modal` provides provides metadata modal service.
   *
   * Requires {@link http://angular-ui.github.io/bootstrap/ `Angular-bootstrap`}
   *
   * | Components                                                                                  |
   * |---------------------------------------------------------------------------------------------|
   * | {@link horizon.app.metadata.modal.service:modalService `modalService`}                 |
   * | {@link horizon.app.metadata.modal.controller:MetadataModalController `MetadataModalController`} |
   * | {@link horizon.app.metadata.modal.controller:MetadataModalHelperController `MetadataModalHelperController`} |
   *
   */
  /*eslint-enable max-len */
  angular
    .module('horizon.app.metadata.modal', [])
    .constant('horizon.app.metadata.modal.constants', {
      backdrop: 'static',
      controller: 'MetadataModalController as modal',
      windowClass: 'modal-dialog-metadata'
    });

})();
