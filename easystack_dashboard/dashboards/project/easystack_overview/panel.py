# vim: tabstop=4 shiftwidth=4 softtabstop=4

# Copyright 2012 United States Government as represented by the
# Administrator of the National Aeronautics and Space Administration.
# All Rights Reserved.
#
# Copyright 2012 Nebula, Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

from django.utils.translation import ugettext_lazy as _  # noqa

import horizon

from easystack_dashboard.dashboards.project import dashboard

from easystack_dashboard.api import keystone


class easystack_overview(horizon.Panel):
    name = _("Overview")
    slug = 'easystack_overview'

    def can_access(self, context):
        request = context['request']
        public_region = keystone.is_public_region(request,'easystack_overview')
        if public_region:
            return False
        return True

dashboard.Project.register(easystack_overview)
