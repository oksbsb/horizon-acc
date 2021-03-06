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

  angular.module('hz.dashboard.project.volume_snapshots')

  /**
   * @ngDoc createAction
   * @ngService
   *
   * @Description
   * Brings up the create volume modal dialog.
   * On submit, create a new volume and display a success message.
   * On cancel, do nothing.
   */
  .factory('createSnapshotVolumeAction', ['horizon.openstack-service-api.cinder', '$modal', 'backDrop',
                                          'horizon.framework.widgets.toast.service',
  function(cinderAPI, modal, backDrop, toastService) {

    var context = {
      mode: 'create',
      title: gettext('Create Volume'),
      submit: gettext('Create'),
      success: gettext('Volume %s was successfully created.')
    };

    function action(scope) {

      /*jshint validthis: true */
      var self = this;
      var option = {
        templateUrl: 'form/',
        controller: 'snapshotsVolumeFormCtrl',
        backdrop: backDrop,
        windowClass: 'volumesListContent',
        resolve: {
          volume: function(){ return {}; },
          context: function(){ return context; }
        }
      };

      self.open = function(snapshots){
        var snapshot = snapshots[0];
        var volume = {
          snapshot_id: snapshot.id,
          size: snapshot.size,
          volume_type: snapshot.volume_type
        };
        option.resolve.volume = function(){ return volume; };
        modal.open(option).result.then(function(){
          self.submit(snapshot, volume);
        });
      };

      self.cleanObj = function(obj){
        if(obj.volume_type === 'sharable'){
            obj.multiattach = true;
            obj.metadata = {attached_mode: "ro"};
        } else {
            obj.multiattach = false;
            obj.metadata = {attached_mode: "rw"};
        }
        return obj;
      };

      self.submit = function(snapshot, newVolume) {
        newVolume = self.cleanObj(newVolume)
        cinderAPI.createVolume(newVolume)
          .success(function(response) {
            var message = interpolate(context.success, [newVolume.name]);
            toastService.add('success', message);
            scope.selectedData.aData[0].numberOfCreateVolume += 1;
            scope.$table.resetSelected();
          });
      };
    }

    return action;
  }]);

})();
