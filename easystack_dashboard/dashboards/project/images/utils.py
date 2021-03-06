from django.utils.translation import ugettext_lazy as _  # noqa

from horizon import exceptions

from easystack_dashboard.api import glance


def get_available_images(request, project_id=None, images_cache=None):
    """
    Returns a list of images that are public or owned by the given
    project_id. If project_id is not specified, only public images
    are returned.

    :param images_cache:
    An optional dict-like object in which to
    cache public and per-project id image metadata.
    """
    if images_cache is None:
        images_cache = {}
    public_images = images_cache.get('public_images', [])
    images_by_project = images_cache.get('images_by_project', {})
    if 'public_images' not in images_cache:
        public = {"is_public": True,
                  "status": "active"}
        try:
            images, _more, _prev = glance.image_list_detailed(
                request, filters=public)
            [public_images.append(image) for image in images]
            images_cache['public_images'] = public_images
        except Exception:
            exceptions.handle(request,
                              _("Unable to retrieve public images."))

    # Preempt if we don't have a project_id yet.
    if project_id is None:
        images_by_project[project_id] = []

    if project_id not in images_by_project:
        owner = {"property-owner_id": project_id,
                 "status": "active"}
        try:
            owned_images, _more, _prev = glance.image_list_detailed(
                request, filters=owner)
            images_by_project[project_id] = owned_images
        except Exception:
            owned_images = []
            exceptions.handle(request,
                              _("Unable to retrieve images for the current project."))
    else:
        owned_images = images_by_project[project_id]

    if 'images_by_project' not in images_cache:
        images_cache['images_by_project'] = images_by_project

    images = owned_images + public_images

    # Remove duplicate images
    image_ids = []
    final_images = []
    for image in images:
        if image.id not in image_ids:
            image_ids.append(image.id)
            final_images.append(image)
    return [image for image in final_images
            if image.container_format not in ('aki', 'ari')]
