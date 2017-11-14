from django.utils.translation import ugettext_lazy as _  # noqa

import horizon

from easystack_dashboard.dashboards.project import dashboard

from easystack_dashboard.api import keystone


class Server_groups(horizon.Panel):
    name = _("Server Groups")
    slug = 'server_groups'

    def can_access(self, context):
        request = context['request']
        public_region = keystone.is_public_region(request,'Server_groups')
        if public_region:
            return False
        return True


dashboard.Project.register(Server_groups)
