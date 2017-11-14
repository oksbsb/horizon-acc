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

  angular.module('hz.dashboard.project.network_policy')

  /**
   * @ngDoc createAction
   * @ngService
   *
   * @Description
   * Brings up the create router modal dialog.
   * On submit, create a new router and display a success message.
   * On cancel, do nothing.
   */
  .factory('createl3PolicyAction', [
        '$modal',
        'backDrop',
        'horizon.openstack-service-api.gbp',
        'horizon.framework.widgets.toast.service',
  function(modal, backDrop, gbpAPI, toastService) {

    var context = {
      mode: 'create',
      title: gettext('Create L3 Policy'),
      submit:  gettext('Create'),
      success: gettext('L3 Policy %s was successfully created.')
    };

    function action(scope) {

      /*jshint validthis: true */
      var self = this,
          option,
          clean;

      option = {
        templateUrl: 'l3_policy_form/',
        controller: 'l3PolicyFormCtrl',
        backdrop:   backDrop,
        windowClass: 'routersListContent',
        resolve: {
          l3_policy: function(){ return {}; },
          context: function(){ return context; }
        }
      };

      clean = function(policys){
        var policy = policys;
        return {
          name:                     policy.name,
          description:              policy.description,
          ip_version:               policy.ip_version.value,
          ip_pool:                  policy.ip_pool,
          subnet_prefix_length:     policy.subnet_prefix_length,
          external_segments:        policy.external_segments,
          shared:                   policy.shared
        };
      };

      self.open = function(){
        modal.open(option).result.then(self.submit);
      };

      self.submit = function(l3policy) {
        var newClean = clean(l3policy);
        gbpAPI.createL3Policy(newClean)
          .success(function(response) {
            scope.$parent.$broadcast('l3policyRefresh');
            var message = interpolate(context.success, [newClean.name]);
            toastService.add('success', message);
          });
      };
    }

    return action;
  }]);

})();
