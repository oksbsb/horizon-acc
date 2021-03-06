from django.utils.translation import ugettext_lazy as _  # noqa

import horizon

from easystack_dashboard.dashboards.project import dashboard


class Volumes(horizon.Panel):
    name = _("Volumes")
    slug = 'volumes'
    permissions = ('openstack.services.volume',)


dashboard.Project.register(Volumes)
