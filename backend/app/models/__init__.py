# Import models so SQLAlchemy can register them in Base.metadata
from app.models import user  # noqa: F401
from app.models import product  # noqa: F401
from app.models import warehouse  # noqa: F401
from app.models import stock_move  # noqa: F401
from app.models import stock  # noqa: F401
from app.models import operations  # noqa: F401
from app.models import password_reset  # noqa: F401
