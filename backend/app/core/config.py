from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    app_name: str = "CoreInventory"
    debug: bool = True

    # Database
    database_url: PostgresDsn = "postgresql://postgres:postgres@localhost:5432/coreinventory"

    # Auth
    jwt_secret: str = "CHANGE_ME"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

@lru_cache()
def get_settings() -> Settings:
    return Settings()
