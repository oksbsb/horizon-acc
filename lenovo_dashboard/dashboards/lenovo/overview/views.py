from horizon import views


class IndexView(views.APIView):
    # A very simple class-based view...
    template_name = 'lenovo/overview/index.html'

