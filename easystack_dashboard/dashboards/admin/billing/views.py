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

from horizon import tabs

from easystack_dashboard.dashboards.admin.billing \
    import tabs as billing_tabs
from easystack_dashboard.dashboards.admin.billing.accounts \
    import tabs as accounts_tabs


class IndexView(tabs.TabbedTableView):
    tab_group_class = billing_tabs.BillingTabs
    template_name = 'admin/billing/index.html'


class DetailView(tabs.TabbedTableView):
    tab_group_class = accounts_tabs.AccountDetailTabs
    template_name = 'admin/billing/accounts/detail.html'
