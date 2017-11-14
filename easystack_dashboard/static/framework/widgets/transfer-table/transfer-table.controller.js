/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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

(function() {
  'use strict';

  /**
    * @ngdoc controller
    * @name horizon.framework.widgets.transfer-table.controller:transferTableController
    * @description
    * The `transferTableController` controller provides functions for allocating
    * and deallocating to and from the 'allocated' array, respectively.
    *
    * This controller can be accessed through `trCtrl`. See examples below.
    *
    * Functions and objects available:
    *
    *   allocate - add row to allocated array
    *     Provide this as callback for the allocate button
    *     <action-list>
    *       <action callback="trCtrl.allocate" item="row"></action>
    *     </action-list>
    *
    *   deallocate - remove row from allocated array
    *     Provide this as callback for the deallocate button
    *     <action-list>
    *       <action callback="trCtrl.deallocate" item="row"></action>
    *     </action-list>
    *
    *   updateAllocated - update allocated array after re-order
    *     This is needed if drag and drop re-ordering is enabled in
    *     the allocated table.
    *     <table st-table="displayedAllocated" st-safe-src="allocated"
    *       lr-drag-data="displayedAllocated"
    *       lr-drag-src="reorder" lr-drop-target="reorder"
    *       lr-drop-success="trCtrl.updateAllocated(e, item, collection)">
    *       ... table definition ...
    *     </table>
    *
    *   tooltipModel - custom warning tooltip model
    *     Use this with the allocate button (action-list)
    *     <action-list button-tooltip bt-model="trCtrl.tooltipModel">
    *       <action>...</action>
    *     </action-list>
    *
    */
  angular
    .module('horizon.framework.widgets.transfer-table')
    .controller('transferTableController', TransferTableController);

  TransferTableController.$inject = [
    'horizon.framework.widgets.basePath',
    '$scope',
    '$timeout',
    '$parse',
    '$attrs',
    '$log',
    'horizon.framework.widgets.transfer-table.helpText',
    'horizon.framework.widgets.transfer-table.limits'
  ];

  function TransferTableController(path, $scope, $timeout, $parse, $attrs, $log, helpText, limits) {
    var trModel = $parse($attrs.trModel)($scope);
    var trHelpText = $parse($attrs.helpText)($scope);
    var trLimits = $parse($attrs.limits)($scope);

    if (!angular.isArray(trModel.allocated)) {
      $log.error('Allocated is not an array as required.');
    }

    var model = this;

    model.allocate = allocate;
    model.deallocate = deallocate;
    model.toggleView = toggleView;
    model.updateAllocated = updateAllocated;
    model.numAllocated = numAllocated;
    model.numDisplayedAvailable = numDisplayedAvailable;

    model.helpText = angular.extend({}, helpText, trHelpText);
    model.limits = angular.extend({}, limits, trLimits);
    model.numAvailable = trModel.available ? trModel.available.length : 0;
    model.views = { allocated: true, available: true };

    // Tooltip model
    model.tooltipModel = {
      templateUrl: path + 'action-list/warning-tooltip.html',
      data: {
        clickMessage: gettext('Click here to expand the row and view the errors.'),
        expandDetail: function() {
          var row = this.element.closest('tr');
          if (!row.hasClass('expanded')) {
            // Timeout needed to prevent
            // $apply already in progress error
            $timeout(function() {
              row.find('[hz-expand-detail]').click();
            }, 0, false);
          }
        }
      }
    };

    // Update tracking of allocated IDs when allocated changed
    $scope.$watchCollection(function() {
      return trModel.allocated;
    }, function(newAllocated) {
      setAllocatedIds(newAllocated);
    });

    // Update available count when available changed
    $scope.$watchCollection(function() {
      return trModel.available;
    }, function(newAvailable) {
      var numAvailable = newAvailable ? newAvailable.length : 0;
      var numAllocated = trModel.allocated ? trModel.allocated.length : 0;
      model.numAvailable = numAvailable - numAllocated;
    });

    // Initialize tracking of allocated IDs
    setAllocatedIds(trModel.allocated);

    //////////

    // helper function
    function setAllocatedIds(allocatedRows) {
      model.allocatedIds = {};
      if (allocatedRows) {
        angular.forEach(allocatedRows, function(alloc) {
          model.allocatedIds[alloc.id] = true;
        });

        if (trModel.available) {
          model.numAvailable = trModel.available.length - allocatedRows.length;
        } else {
          model.numAvailable = 0;
        }
      } else {
        trModel.allocated = [];
        trModel.displayedAllocated = [];
      }
    }

    function allocate(row) {
      if (model.limits.maxAllocation < 0 ||
          trModel.allocated.length < model.limits.maxAllocation) {
        // Add to allocated only if limit not reached
        trModel.allocated.push(row);

        model.numAvailable -= 1;
      } else if (model.limits.maxAllocation === 1) {
        // Swap out rows if only one allocation allowed
        trModel.allocated.pop();

        // When swapping out, Smart-Table $watch is
        // not detecting change so timeout is used
        // as workaround.
        $timeout(function() {
          trModel.allocated.push(row);
          $scope.$apply();
        }, 0, false);
      }
    }

    function deallocate(row) {
      model.numAvailable += 1;
      var allocLen = trModel.allocated.length;
      for (var i = allocLen - 1; i >= 0; i--) {
        if (trModel.allocated[i].id === row.id) {
          trModel.allocated.splice(i, 1);
        }
      }
    }

    // Show/hide allocated or available sections
    function toggleView(view) {
      var show = model.views[view];
      model.views[view] = !show;
    }

    // Allocated array needs to be updated when rows re-ordered
    function updateAllocated(e, item, orderedItems) {
      var allocLen = trModel.allocated.length;
      trModel.allocated.splice(0, allocLen);
      Array.prototype.push.apply(trModel.allocated, orderedItems);
    }

    function numAllocated() {
      return trModel.allocated ? trModel.allocated.length : 0;
    }

    function numDisplayedAvailable() {
      if (trModel.displayedAvailable) {
        var filtered = trModel.displayedAvailable.filter(function(avail) {
          return !model.allocatedIds[avail.id];
        });

        return filtered.length;
      }
      return 0;
    }
  }

})();
