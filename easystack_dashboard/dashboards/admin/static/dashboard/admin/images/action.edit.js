/**
 * Copyright 2015 EasyStack Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  angular.module('hz.dashboard.admin.images')

  /**
   * @ngDoc editAction
   * @ngService
   *
   * @Description
   * Brings up the edit image modal dialog.
   * On submit, edit image and display a success message.
   * On cancel, do nothing.
   */
  .factory('editImageAction', ['horizon.openstack-service-api.glance',
                               '$modal', 'backDrop',
                               'horizon.framework.widgets.toast.service',
  function(glanceAPI, modal, backdrop, toastService) {

    var context = {
      mode: 'edit',
      title: gettext('Edit Image'),
      submit:  gettext('Save'),
      success: gettext('Image %s has been updated successfully.')
    };

    function action(scope) {
      /*jshint validthis: true */
      var self = this;
      var option = {
        templateUrl: 'form',
        controller: 'imageFormCtrl',
        backdrop: backdrop,
        resolve: {
          image: function(){ return null; },
          context: function(){ return context; }
        },
        windowClass: 'imagesListContent'
      };

      // open up the edit form
      self.open = function(image) {
        var clone = angular.copy(image[0]);
        option.resolve.image = function(){ return clone; };
        modal.open(option).result.then(function(clone){
          self.submit(image[0], clone);
        });
      };

      // send only what is required
      self.clean = function(image) {
        return {
          id: image.id,
          name: image.name,
          min_disk: image.min_disk,
          min_ram: image.min_ram,
          visibility: image.is_public?'public':'private',
          protected: image.protected
        };
      };

      // submit this action to api
      // and update image object on success
      self.submit = function(image, clone) {
        var cleanedImage = self.clean(clone);
        glanceAPI.editImage(cleanedImage)
          .success(function() {
            var message = interpolate(context.success, [clone.name]);
            toastService.add('success', message);
            angular.extend(image, clone);

            scope.$table.resetSelected();
          });
      };
    }

    return action;
  }]);

})();
